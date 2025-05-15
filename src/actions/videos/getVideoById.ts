"use server";
import { createClient } from "@/lib/supabase/server";

// Get video by ID with teacher information
export async function getVideoById(id: string): Promise<{
  success: boolean;
  data?: any;
}> {
  const supabase = await createClient();
  console.log(id, "id");
  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (videoError || !video) {
    console.error("Error fetching video:", videoError);
    return { success: false };
  }

  console.log(video, video.teacher_id, "teacher di");
  const { data: teacher, error: teacherError } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_url")
    .eq("id", video.teacher_id)
    .single();

  if (teacherError || !teacher) {
    console.error("Error fetching teacher:", teacherError);
    return { success: false };
  }

  if (!video) {
    console.error("Error fetching video:", videoError);
    return {
      success: false,
    };
  }

  console.log({
    ...video,
    ...teacher,
  });
  return {
    success: true,
    data: {
      ...video,
      teacher: {
        ...teacher,
      },
    },
  };
}
