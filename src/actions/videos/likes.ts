"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

// Get user's like status for a video
export async function getUserLikeStatus(videoId: string) {
  const cookieStore = cookies();
  const supabase = await createClient();

  //todo
  const userId = "";

  const { data, error } = await supabase
    .from("video_likes")
    .select("is_like")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No record found
      return null;
    }
    console.error("Error fetching user like status:", error);
    return null;
  }

  return data.is_like;
}

// Toggle like/dislike
export async function toggleVideoLike(videoId: string, isLike: boolean) {
  const cookieStore = cookies();
  const supabase = await createClient();

  const userId = "";

  // Check if user already liked/disliked
  const { data: existingLike, error: fetchError } = await supabase
    .from("video_likes")
    .select("*")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error checking existing like:", fetchError);
    return { success: false, error: "Failed to check existing like" };
  }

  let result;

  if (existingLike) {
    if (existingLike.is_like === isLike) {
      // Remove like/dislike if clicking the same button
      result = await supabase
        .from("video_likes")
        .delete()
        .eq("id", existingLike.id);
    } else {
      // Update like/dislike if changing opinion
      result = await supabase
        .from("video_likes")
        .update({ is_like: isLike })
        .eq("id", existingLike.id);
    }
  } else {
    // Create new like/dislike
    result = await supabase.from("video_likes").insert({
      video_id: videoId,
      user_id: userId,
      is_like: isLike,
    });
  }

  if (result.error) {
    console.error("Error toggling like:", result.error);
    return { success: false, error: "Failed to update like status" };
  }

  revalidatePath(`/videos/${videoId}`);
  return { success: true };
}
