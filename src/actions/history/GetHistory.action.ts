import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";

export async function getHistory(userId: string): Promise<{
  success: boolean;
  data: RelatedVideo[];
}> {
  const supabase = await createClient();

  // Step 1: Get the user's history
  const { data: history, error: historyError } = await supabase
    .from("history")
    .select("video_id, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (historyError || !history) {
    console.error("Error fetching history:", historyError);
    return { success: false, data: [] };
  }

  // Step 2: Get each video separately + teacher info
  const enrichedVideos = await Promise.all(
    history.map(async (entry: { video_id: string }) => {
      const { data: video, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", entry.video_id)
        .single();

      if (videoError || !video) {
        console.error(`Error fetching video ${entry.video_id}:`, videoError);
        return null;
      }

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
      }

      return {
        id: video.id,
        title: video.title,
        thumbnail_url: video.thumbnail_url,
        created_at: video.created_at,
        views: video.views,
        branch: video.branch,
        class: video.class,
        subject: video.subject,
        teacher: teacher || null,
      };
    })
  );

  return {
    success: true,
    data: enrichedVideos.filter(Boolean) as RelatedVideo[],
  };
}
