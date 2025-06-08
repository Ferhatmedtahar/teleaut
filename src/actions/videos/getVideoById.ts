"use server";
import { createClient } from "@/lib/supabase/server";

// Get video by ID with teacher information
export async function getVideoById(id: string): Promise<{
  success: boolean;
  data?: any;
}> {
  const supabase = await createClient();

  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("*")
    .eq("id", id)
    .single();

  if (videoError || !video) {
    console.error("Error fetching video:", videoError);
    return { success: false };
  }

  const [documentsRes, notesRes] = await Promise.all([
    video.documents_url
      ? supabase
          .from("user_files")
          .select("title")
          .eq("file_url", video.documents_url)
          .in("file_type", ["documents", "notes"])
      : Promise.resolve({ data: [], error: null }),

    video.notes_url
      ? supabase
          .from("user_files")
          .select("title")
          .eq("file_url", video.notes_url)
          .in("file_type", ["documents", "notes"])
      : Promise.resolve({ data: [], error: null }),
  ]);

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

  return {
    success: true,
    data: {
      ...video,
      teacher: {
        ...teacher,
      },
      documentsAndNotes: {
        documents: documentsRes.data,
        notes: notesRes.data,
      },
    },
  };
}
