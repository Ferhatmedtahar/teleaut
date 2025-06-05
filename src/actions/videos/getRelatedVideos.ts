"use server";

import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";

// Get related videos by subject and class (excluding current video), with teacher info
// If no related videos found, fallback to latest videos
export async function getRelatedVideos(
  currentVideoId: string,
  subject: string,
  classValue: string,
  limit = 6
): Promise<{
  success: boolean;
  data: RelatedVideo[];
  isFallback?: boolean;
}> {
  const supabase = await createClient();

  const { data: relatedVideos, error: relatedError } = await supabase
    .from("videos")
    .select("*")
    .neq("id", currentVideoId)
    .eq("subject", subject)
    .eq("class", classValue.toLowerCase())
    .order("views", { ascending: false })
    .limit(limit);

  if (relatedError) {
    console.error("Error fetching related videos:", relatedError);
    return { success: false, data: [] };
  }

  let videosToProcess = relatedVideos || [];
  let isFallback = false;

  if (videosToProcess.length === 0) {
    console.log("No related videos found, fetching latest videos as fallback");

    const { data: latestVideos, error: latestError } = await supabase
      .from("videos")
      .select("*")
      .neq("id", currentVideoId) // Still exclude current video
      .order("created_at", { ascending: false }) // Order by latest
      .limit(limit);

    if (latestError) {
      console.error("Error fetching latest videos:", latestError);
      return { success: false, data: [] };
    }

    videosToProcess = latestVideos || [];
    isFallback = true;
  }

  if (videosToProcess.length === 0) {
    return { success: true, data: [], isFallback };
  }

  // Enrich videos with teacher information
  const enrichedVideos = await Promise.all(
    videosToProcess.map(async (video) => {
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
    isFallback,
  };
}
