"use server";

import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Get user's like status for a video
export async function getUserLikeStatus(videoId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, data: null, message: "Not authenticated" };
  }

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) {
    return { success: false, data: null, message: "Invalid token" };
  }

  const supabase = await createClient();
  const userId = decoded.id;

  const { data, error } = await supabase
    .from("video_likes")
    .select("is_like")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return { success: true, data: null, message: "No like status found" };
    }
    console.error("Error fetching user like status:", error);
    return {
      success: false,
      data: null,
      message: "Failed to fetch like status",
    };
  }

  return { success: true, data: data.is_like, message: "Fetched like status" };
}

// Toggle like/dislike
export async function toggleVideoLike(videoId: string, isLike: boolean) {
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
  const userId = decoded.id;

  // Check if user already liked/disliked
  const { data: existingLike, error: fetchError } = await supabase
    .from("video_likes")
    .select("*")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error checking existing like:", fetchError);
    return { success: false, message: "Failed to check existing like" };
  }

  let result;

  if (existingLike) {
    if (existingLike.is_like === isLike) {
      // Remove like/dislike
      result = await supabase
        .from("video_likes")
        .delete()
        .eq("id", existingLike.id);
    } else {
      // Update to new like/dislike
      result = await supabase
        .from("video_likes")
        .update({ is_like: isLike })
        .eq("id", existingLike.id);
    }
  } else {
    // Insert new like/dislike
    result = await supabase.from("video_likes").insert({
      video_id: videoId,
      user_id: userId,
      is_like: isLike,
    });
  }

  if (result.error) {
    console.error("Error toggling like:", result.error);
    return { success: false, message: "Failed to update like status" };
  }

  revalidatePath(`/videos/${videoId}`);
  return { success: true, message: "Like status updated" };
}

// Get video likes count
export async function getVideoLikesCount(videoId: string) {
  const supabase = await createClient();

  const { count: likesCount, error: likesError } = await supabase
    .from("video_likes")
    .select("*", { count: "exact", head: true })
    .eq("video_id", videoId)
    .eq("is_like", true);

  const { count: dislikesCount, error: dislikesError } = await supabase
    .from("video_likes")
    .select("*", { count: "exact", head: true })
    .eq("video_id", videoId)
    .eq("is_like", false);

  if (likesError || dislikesError) {
    console.error("Error fetching likes count:", likesError || dislikesError);
    return {
      success: false,
      data: { likes: 0, dislikes: 0 },
      message: "Failed to fetch likes count",
    };
  }

  return {
    success: true,
    data: { likes: likesCount ?? 0, dislikes: dislikesCount ?? 0 },
  };
}
