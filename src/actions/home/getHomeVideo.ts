"use server";

import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";

export async function getVideosGuestPage(
  search: string,
  limit = 8
): Promise<{
  success: boolean;
  videos: RelatedVideo[];
}> {
  const supabase = await createClient();

  try {
    if (!search) {
      const { data: videos, error } = await supabase
        .from("videos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        console.error("Error fetching guest page videos:", error);
        return { success: false, videos: [] };
      }

      const videosWithTeachers = await Promise.all(
        videos.map(async (video) => {
          const { data: teacher, error: teacherError } = await supabase
            .from("users")
            .select("id, first_name, last_name, profile_url")
            .eq("id", video.teacher_id)
            .single();

          return {
            ...video,
            teacher: teacherError ? null : teacher,
          };
        })
      );

      return { success: true, videos: videosWithTeachers };
    } else {
      const { data: videos, error } = await supabase
        .from("videos")
        .select("*")
        .or(
          `title.ilike.%${search}%, description.ilike.%${search}%, subject.ilike.%${search}%`
        )
        .order("created_at", { ascending: false })
        .limit(limit)
        .not("is_featured", "eq", true)
        .not("class", "eq", "FEATURED");
      if (error) {
        console.error("Error fetching guest page videos:", error);
        return { success: false, videos: [] };
      }

      const videosWithTeachers = await Promise.all(
        videos.map(async (video) => {
          const { data: teacher, error: teacherError } = await supabase
            .from("users")
            .select("id, first_name, last_name, profile_url")
            .eq("id", video.teacher_id)
            .single();

          return {
            ...video,
            teacher: teacherError ? null : teacher,
          };
        })
      );

      return { success: true, videos: videosWithTeachers };
    }
  } catch (error) {
    console.error("Unexpected error in getVideosGuestPage:", error);
    return { success: false, videos: [] };
  }
}
