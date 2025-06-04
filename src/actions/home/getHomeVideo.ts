// "use server";
// import { createClient } from "@/lib/supabase/server";
// export async function getVideosGuestPage() {}
"use server";

import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";

export async function getVideosGuestPage(limit = 8): Promise<{
  success: boolean;
  videos: RelatedVideo[];
}> {
  const supabase = await createClient();

  try {
    const { data: videos, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching guest page videos:", error);
      return { success: false, videos: [] };
    }

    // Optional: Fetch teacher info for each video
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
  } catch (error) {
    console.error("Unexpected error in getVideosGuestPage:", error);
    return { success: false, videos: [] };
  }
}
