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
  if (!decoded || !decoded.id) {
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

  const { error } = await supabase.from("video_comments").insert({
    video_id: videoId,
    user_id: decoded.id,
    content: content,
  });

  if (error) {
    console.error("Error adding comment:", error);
    return { success: false, message: "Failed to add comment" };
  }

  revalidatePath(`/videos/${videoId}`);
  return { success: true, message: "Comment added successfully" };
}

//!Get all comments

export async function getVideoComments(
  videoId: string,
  page = 1,
  pageSize = 10
) {
  const supabase = await createClient();

  try {
    // Fetch pinned comments
    const { data: pinnedCommentsRaw, error: pinnedError } = await supabase
      .from("video_comments")
      .select("*")
      .eq("video_id", videoId)
      .eq("is_pinned", true)
      .order("created_at", { ascending: false });

    if (pinnedError) throw pinnedError;

    // Fetch regular comments (paginated)
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

    // Get all unique user IDs from both pinned and regular comments
    const userIds = [
      ...new Set([
        ...(pinnedCommentsRaw || []).map((c) => c.user_id),
        ...(commentsRaw || []).map((c) => c.user_id),
      ]),
    ];

    // Fetch user data in a single query
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url")
      .in("id", userIds);

    if (usersError) throw usersError;

    // Create a map of user_id -> user
    const userMap = new Map(users.map((u) => [u.id, u]));

    // Enrich comments with user info
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
