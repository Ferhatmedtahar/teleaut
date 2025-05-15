"use server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Get video by ID with teacher information
export async function getVideoById(id: string) {
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data: video, error } = await supabase
    .from("videos")
    .select(
      `
      *,
      teacher:teacher_id (
        id,
        name,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching video:", error);
    return null;
  }

  return video;
}

// Get video likes count
export async function getVideoLikesCount(videoId: string) {
  const cookieStore = cookies();
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
    return { likes: 0, dislikes: 0 };
  }

  return { likes: likesCount || 0, dislikes: dislikesCount || 0 };
}
