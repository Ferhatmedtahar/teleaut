"use server";

import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { roles } from "@/types/roles.enum";

// Get home page videos (latest videos + featured video)
export async function getHomePageVideos(): Promise<{
  success: boolean;
  featuredVideo: RelatedVideo | null;
  explorerVideos: RelatedVideo[];
}> {
  const supabase = await createClient();

  try {
    // Get the latest video as featured (most recent by created_at)
    const { data: featuredVideos, error: featuredError } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (featuredError) {
      console.error("Error fetching featured video:", featuredError);
      return { success: false, featuredVideo: null, explorerVideos: [] };
    }

    // Get other recent videos for explorer section (excluding the featured one)
    const { data: explorerVideosData, error: explorerError } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .neq("id", featuredVideos[0]?.id || "");

    if (explorerError) {
      console.error("Error fetching explorer videos:", explorerError);
      return { success: false, featuredVideo: null, explorerVideos: [] };
    }

    // Get teacher info for featured video
    let featuredVideoWithTeacher = null;
    if (featuredVideos && featuredVideos.length > 0) {
      const { data: featuredTeacher, error: featuredTeacherError } =
        await supabase
          .from("users")
          .select("id, first_name, last_name, profile_url")
          .eq("id", featuredVideos[0].teacher_id)
          .single();

      featuredVideoWithTeacher = {
        ...featuredVideos[0],
        teacher: featuredTeacherError ? null : featuredTeacher,
      };
    }

    // Get teacher info for explorer videos
    const explorerVideosWithTeachers = await Promise.all(
      explorerVideosData.map(async (video) => {
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

    return {
      success: true,
      featuredVideo: featuredVideoWithTeacher,
      explorerVideos: explorerVideosWithTeachers,
    };
  } catch (error) {
    console.error("Error in getHomePageVideos:", error);
    return { success: false, featuredVideo: null, explorerVideos: [] };
  }
}

// Get search results based on query
export async function getSearchResults(query: string): Promise<{
  success: boolean;
  videos: RelatedVideo[];
  teachers: any[];
  students: any[];
}> {
  const supabase = await createClient();

  try {
    // Search videos based on title, description, and subject
    const { data: videos, error: videosError } = await supabase
      .from("videos")
      .select("*")
      .or(
        `title.ilike.%${query}%, description.ilike.%${query}%, subject.ilike.%${query}%`
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (videosError) {
      console.error("Error searching videos:", videosError);
      return { success: false, videos: [], teachers: [], students: [] };
    }

    // Search teachers based on name
    const { data: teachers, error: teachersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url , specialties")
      .or(`first_name.ilike.%${query}%, last_name.ilike.%${query}%`)
      .eq("role", roles.teacher)
      .limit(10);

    if (teachersError) {
      console.error("Error searching teachers:", teachersError);
      return { success: false, videos: [], teachers: [], students: [] };
    }

    // Search students based on name
    const { data: students, error: studentsError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url")
      .or(`first_name.ilike.%${query}%, last_name.ilike.%${query}%`)
      .eq("role", roles.student)
      .limit(10);

    if (studentsError) {
      console.error("Error searching students:", studentsError);
      return { success: false, videos: [], teachers: [], students: [] };
    }

    // Enrich videos with teacher information
    const videosWithTeachers = await Promise.all(
      (videos || []).map(async (video) => {
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

    return {
      success: true,
      videos: videosWithTeachers,
      teachers: teachers || [],
      students: students || [],
    };
  } catch (error) {
    console.error("Error in getSearchResults:", error);
    return { success: false, videos: [], teachers: [], students: [] };
  }
}
