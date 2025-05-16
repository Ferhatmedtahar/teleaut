"use server";
import { createClient } from "@/lib/supabase/server";

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  created_at: string;
  views: number;
  teacher: {
    id: string;
    first_name: string;
    last_name?: string;
    profile_url: string | null;
  };
}
// Get related videos by subject and class (excluding current video), with teacher info
export async function getRelatedVideos(
  currentVideoId: string,
  subject: string,
  classValue: string,
  limit = 8
): Promise<{
  success: boolean;
  data: RelatedVideo[];
}> {
  const supabase = await createClient();

  const { data: videos, error: videosError } = await supabase
    .from("videos")
    .select("*")
    .neq("id", currentVideoId)
    .eq("subject", subject)
    .eq("class", classValue)
    .order("views", { ascending: false })
    .limit(limit);

  if (videosError || !videos) {
    console.error("Error fetching related videos:", videosError);
    return { success: false, data: [] };
  }

  const enrichedVideos = await Promise.all(
    videos.map(async (video) => {
      const { data: teacher, error: teacherError } = await supabase
        .from("users")
        .select("id, first_name, last_name, profile_url")
        .eq("id", video.teacher_id)
        .single();

      if (teacherError) {
        console.error(
          `Error fetching teacher for video ${video.id}:`,
          teacherError
        );
        return {
          ...video,
          teacher: null,
        };
      }

      return {
        ...video,
        teacher,
      };
    })
  );

  return {
    success: true,
    data: enrichedVideos,
  };
}
