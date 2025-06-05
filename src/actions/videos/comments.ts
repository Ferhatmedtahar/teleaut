"use server";

import { verifyToken } from "@/app/(auth)/_lib/verifyToken"; // adjust path if needed
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

const CommentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

// Add a comment to a video
export async function addComment(videoId: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  const decoded = await verifyToken(token);
  if (!decoded?.id) {
    return { success: false, message: "Invalid token" };
  }

  const supabase = await createClient();
  const content = formData.get("content") as string;

  const validation = CommentSchema.safeParse({ content });
  if (!validation.success) {
    return {
      success: false,
      message: validation.error.errors[0]?.message || "Invalid comment",
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("video_comments")
    .insert({
      video_id: videoId,
      user_id: decoded.id,
      content,
    })
    .select("id, content, created_at, is_pinned, user_id")
    .single();

  if (insertError || !inserted) {
    console.error("Insert error:", insertError);
    return { success: false, message: "Failed to insert comment" };
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id, first_name, profile_url")
    .eq("id", inserted.user_id)
    .single();

  if (userError || !userData) {
    console.error("User fetch error:", userError);
    return { success: false, message: "Failed to fetch user data" };
  }

  revalidatePath(`/videos/${videoId}`);

  return {
    success: true,
    comment: {
      id: inserted.id,
      content: inserted.content,
      created_at: inserted.created_at,
      is_pinned: inserted.is_pinned ?? false,
      user: {
        id: userData.id,
        first_name: userData.first_name,
        profile_url: userData.profile_url,
      },
    },
  };
}

//!Get all comments

export async function getVideoComments(
  videoId: string,
  page = 1,
  pageSize = 10
) {
  const supabase = await createClient();

  try {
    const { data: pinnedCommentsRaw, error: pinnedError } = await supabase
      .from("video_comments")
      .select("*")
      .eq("video_id", videoId)
      .eq("is_pinned", true)
      .order("created_at", { ascending: false });

    if (pinnedError) throw pinnedError;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const {
      data: commentsRaw,
      error: commentsError,
      count,
    } = await supabase
      .from("video_comments")
      .select("*", { count: "exact" })
      .eq("video_id", videoId)
      .eq("is_pinned", false)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (commentsError) throw commentsError;

    const userIds = [
      ...new Set([
        ...(pinnedCommentsRaw || []).map((c) => c.user_id),
        ...(commentsRaw || []).map((c) => c.user_id),
      ]),
    ];

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url")
      .in("id", userIds);

    if (usersError) throw usersError;

    const userMap = new Map(users.map((u) => [u.id, u]));

    const pinnedComments =
      pinnedCommentsRaw?.map((comment) => ({
        ...comment,
        user: userMap.get(comment.user_id) || null,
      })) || [];

    const comments =
      commentsRaw?.map((comment) => ({
        ...comment,
        user: userMap.get(comment.user_id) || null,
      })) || [];

    const hasMore = count ? from + comments.length < count : false;

    return {
      success: true,
      data: {
        pinnedComments,
        comments,
        hasMore,
      },
      message: "Comments fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      success: false,
      data: {
        pinnedComments: [],
        comments: [],
        hasMore: false,
      },
      message: "Failed to fetch comments",
    };
  }
}

//!Pin or unpin a comment
export async function togglePinComment(commentId: string, videoId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) {
    return { success: false, message: "Invalid token" };
  }

  const supabase = await createClient();

  const { data: comment, error: commentError } = await supabase
    .from("video_comments")
    .select("is_pinned, video_id")
    .eq("id", commentId)
    .single();

  if (commentError || !comment) {
    console.error("Error fetching comment:", commentError);
    return { success: false, message: "Failed to fetch comment" };
  }

  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("teacher_id")
    .eq("id", comment.video_id)
    .single();

  if (videoError || !video) {
    console.error("Error fetching video:", videoError);
    return { success: false, message: "Failed to fetch video" };
  }

  if (video.teacher_id !== decoded.id) {
    return {
      success: false,
      message: "You are not authorized to pin this comment",
    };
  }

  const { error: toggleError } = await supabase
    .from("video_comments")
    .update({ is_pinned: !comment.is_pinned })
    .eq("id", commentId);

  if (toggleError) {
    console.error("Error updating pin status:", toggleError);
    return { success: false, message: "Failed to update pin status" };
  }

  revalidatePath(`/videos/${videoId}`);
  return { success: true, message: "Pin status updated successfully" };
}
