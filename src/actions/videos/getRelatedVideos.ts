// "use server";

// import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
// import { createClient } from "@/lib/supabase/server";
// import { cookies } from "next/headers";

// // Get related videos
// export async function getRelatedVideos(
//   currentVideoId: string,
//   subject: string,
//   classValue: string,
//   limit = 8
// ) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token")?.value;

//   if (!token) {
//     return { success: false, data: [], message: "Not authenticated" };
//   }

//   const decoded = await verifyToken(token);
//   if (!decoded || !decoded.id) {
//     return { success: false, data: [], message: "Invalid token" };
//   }

//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("videos")
//     .select(
//       `
//       id,
//       title,
//       thumbnail_url,
//       created_at,
//       views,
//       teacher:teacher_id (
//         id,
//         name,
//         avatar_url
//       )
//     `
//     )
//     .neq("id", currentVideoId)
//     .eq("subject", subject)
//     .eq("class", classValue)
//     .order("views", { ascending: false })
//     .limit(limit);

//   if (error) {
//     console.error("Error fetching related videos:", error);
//     return {
//       success: false,
//       data: [],
//       message: "Failed to fetch related videos",
//     };
//   }

//   return {
//     success: true,
//     data: data || [],
//     message: "Related videos fetched successfully",
//   };
// }

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
