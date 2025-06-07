"use server";

import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { roles } from "@/types/roles.enum";
import { getCurrentUser } from "../auth/getCurrentUser.action";

export async function getHomePageVideos(): Promise<{
  success: boolean;
  featuredVideo: RelatedVideo | null;
  explorerVideos: RelatedVideo[];
}> {
  const supabase = await createClient();

  try {
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

// Get current user's branch and class information
export async function getBranchAndClass(): Promise<{
  success: boolean;
  branchAndClass: {
    class: string | null;
    branch: string | null;
    role: string;
  } | null;
}> {
  const supabase = await createClient();

  try {
    const { user, success } = await getCurrentUser();
    if (!success || !user) {
      console.error("Error getting current user:");
      return { success: false, branchAndClass: null };
    }

    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("class, branch, role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return { success: false, branchAndClass: null };
    }

    // Handle different roles
    if (userProfile.role === roles.student) {
      return {
        success: true,
        branchAndClass: {
          class: userProfile.class || null,
          branch: userProfile.branch || null,
          role: userProfile.role,
        },
      };
    } else if (
      userProfile.role === roles.teacher ||
      userProfile.role === roles.admin
    ) {
      // For teachers and admins, return null for class/branch since they don't have these
      return {
        success: true,
        branchAndClass: {
          class: null,
          branch: null,
          role: userProfile.role,
        },
      };
    } else {
      // Unknown role
      return {
        success: false,
        branchAndClass: {
          class: null,
          branch: null,
          role: "unknown role should not happen ERROR",
        },
      };
    }
  } catch (error) {
    console.error("Error in getBranchAndClass:", error);
    return { success: false, branchAndClass: null };
  }
}
