"use server";

import { createClient } from "@/lib/supabase/server";

export async function getSuggestedVideos(
  teacherId: string,
  limit = 6 as number
) {
  if (!teacherId) {
    return { success: false, message: "No teacher ID" };
  }

  const supabase = await createClient();

  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .eq("teacher_id", teacherId)
    .limit(limit);

  if (error) {
    console.error("Error fetching videos:", error);
    return { success: false, message: "Failed to fetch videos" };
  }

  if (!videos) {
    return { success: false, message: "No Videos Found!" };
  }

  if (videos.length === 0) {
    return { success: false, message: "Teacher has no videos" };
  }

  return { success: true, message: "Videos found", videos };
}
