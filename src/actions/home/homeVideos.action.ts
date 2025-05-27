"use server";

import { createClient } from "@/lib/supabase/server";
import { RelatedVideo } from "@/types/RelatedVideos.interface";

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
      return { success: false, videos: [], teachers: [] };
    }

    // Search teachers based on name
    const { data: teachers, error: teachersError } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url")
      .or(`first_name.ilike.%${query}%, last_name.ilike.%${query}%`)
      .eq("role", "teacher") // Assuming you have a role field
      .limit(10);

    if (teachersError) {
      console.error("Error searching teachers:", teachersError);
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
    };
  } catch (error) {
    console.error("Error in getSearchResults:", error);
    return { success: false, videos: [], teachers: [] };
  }
}
// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { RelatedVideo } from "@/types/RelatedVideos.interface";

// interface FilterParams {
//   sortBy?: string;
//   dateFilter?: string;
//   duration?: string;
//   type?: string;
//   selectedClass?: string;
//   selectedBranch?: string;
//   selectedSubjects?: string[];
//   limit?: number;
// }

// // Get latest featured video (most recent by created_at)
// export async function getFeaturedVideo(): Promise<{
//   success: boolean;
//   data: RelatedVideo | null;
// }> {
//   const supabase = await createClient();

//   const { data: videos, error: videosError } = await supabase
//     .from("videos")
//     .select("*")
//     .order("created_at", { ascending: false })
//     .limit(1);

//   if (videosError || !videos || videos.length === 0) {
//     console.error("Error fetching featured video:", videosError);
//     return { success: false, data: null };
//   }

//   const video = videos[0];

//   // Get teacher info for the featured video
//   const { data: teacher, error: teacherError } = await supabase
//     .from("users")
//     .select("id, first_name, last_name, profile_url")
//     .eq("id", video.teacher_id)
//     .single();

//   if (teacherError) {
//     console.error("Error fetching teacher for featured video:", teacherError);
//     return {
//       success: true,
//       data: {
//         ...video,
//         teacher: null,
//       },
//     };
//   }

//   return {
//     success: true,
//     data: {
//       ...video,
//       teacher,
//     },
//   };
// }

// // Get filtered videos based on search criteria
// export async function getFilteredVideos(filters: FilterParams): Promise<{
//   success: boolean;
//   data: RelatedVideo[];
// }> {
//   const supabase = await createClient();

//   let query = supabase.from("videos").select("*");

//   // Apply class filter
//   if (filters.selectedClass && filters.selectedClass !== "") {
//     query = query.eq("class", filters.selectedClass.toLowerCase());
//   }

//   // Apply subject filter
//   if (filters.selectedSubjects && filters.selectedSubjects.length > 0) {
//     query = query.in("subject", filters.selectedSubjects);
//   }

//   // Apply date filter
//   if (filters.dateFilter && filters.dateFilter !== "") {
//     const now = new Date();
//     const dateThreshold = new Date();

//     switch (filters.dateFilter) {
//       case "Dernière heure":
//         dateThreshold.setHours(now.getHours() - 1);
//         break;
//       case "Aujourd'hui":
//         dateThreshold.setHours(0, 0, 0, 0);
//         break;
//       case "Cette semaine":
//         dateThreshold.setDate(now.getDate() - 7);
//         break;
//       case "Ce mois":
//         dateThreshold.setMonth(now.getMonth() - 1);
//         break;
//       case "Cette année":
//         dateThreshold.setFullYear(now.getFullYear() - 1);
//         break;
//     }

//     query = query.gte("created_at", dateThreshold.toISOString());
//   }

//   // Apply duration filter
//   if (filters.duration && filters.duration !== "") {
//     switch (filters.duration) {
//       case "Courte (< 4 min)":
//         query = query.lt("duration", 240); // 4 minutes in seconds
//         break;
//       case "Moyenne (4-20 min)":
//         query = query.gte("duration", 240).lte("duration", 1200); // 4-20 minutes
//         break;
//       case "Longue (> 20 min)":
//         query = query.gt("duration", 1200); // > 20 minutes
//         break;
//     }
//   }

//   // Apply type filter (assuming you have a type field)
//   if (filters.type && filters.type !== "") {
//     query = query.eq("type", filters.type.toLowerCase());
//   }

//   // Apply sorting
//   if (filters.sortBy === "Nombre de vues") {
//     query = query.order("views", { ascending: false });
//   } else if (filters.sortBy === "Date de création") {
//     query = query.order("created_at", { ascending: false });
//   } else {
//     // Default sorting by created_at (latest first)
//     query = query.order("created_at", { ascending: false });
//   }

//   // Apply limit
//   const limit = filters.limit || 20;
//   query = query.limit(limit);

//   const { data: videos, error: videosError } = await query;

//   if (videosError || !videos) {
//     console.error("Error fetching filtered videos:", videosError);
//     return { success: false, data: [] };
//   }

//   // Enrich videos with teacher information
//   const enrichedVideos = await Promise.all(
//     videos.map(async (video) => {
//       const { data: teacher, error: teacherError } = await supabase
//         .from("users")
//         .select("id, first_name, last_name, profile_url")
//         .eq("id", video.teacher_id)
//         .single();

//       if (teacherError) {
//         console.error(
//           `Error fetching teacher for video ${video.id}:`,
//           teacherError
//         );
//         return {
//           ...video,
//           teacher: null,
//         };
//       }

//       return {
//         ...video,
//         teacher,
//       };
//     })
//   );

//   return {
//     success: true,
//     data: enrichedVideos,
//   };
// }

// // Get latest videos (for general display)
// export async function getLatestVideos(limit = 12): Promise<{
//   success: boolean;
//   data: RelatedVideo[];
// }> {
//   const supabase = await createClient();

//   const { data: videos, error: videosError } = await supabase
//     .from("videos")
//     .select("*")
//     .order("created_at", { ascending: false })
//     .limit(limit);

//   if (videosError || !videos) {
//     console.error("Error fetching latest videos:", videosError);
//     return { success: false, data: [] };
//   }

//   const enrichedVideos = await Promise.all(
//     videos.map(async (video) => {
//       const { data: teacher, error: teacherError } = await supabase
//         .from("users")
//         .select("id, first_name, last_name, profile_url")
//         .eq("id", video.teacher_id)
//         .single();

//       if (teacherError) {
//         console.error(
//           `Error fetching teacher for video ${video.id}:`,
//           teacherError
//         );
//         return {
//           ...video,
//           teacher: null,
//         };
//       }

//       return {
//         ...video,
//         teacher,
//       };
//     })
//   );

//   return {
//     success: true,
//     data: enrichedVideos,
//   };
// }
