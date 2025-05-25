"use server";

import { createClient } from "@/lib/supabase/server";

export async function getTeacherVideos(
  teacherId: string,
  limit = 6,
  offset = 0
) {
  if (!teacherId) {
    return { success: false, message: "No teacher ID" };
  }

  const supabase = await createClient();

  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .eq("teacher_id", teacherId)
    .range(offset, offset + limit - 1);

  console.log("Fetched videos:", videos);
  if (error) {
    console.error("Error fetching videos:", error);
    return { success: false, message: "Failed to fetch videos" };
  }

  if (!videos || videos.length === 0) {
    return { success: false, message: "No more videos" };
  }

  return { success: true, message: "Videos found", videos };
}
