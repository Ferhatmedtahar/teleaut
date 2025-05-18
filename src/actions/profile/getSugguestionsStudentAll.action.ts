"use server";
import {
  getApplicableSpecialties,
  getApplicableSubjects,
} from "@/lib/helpers/Profilehelper";
import { createClient } from "@/lib/supabase/server";

/**
 * !Get suggested videos for a student based on their class and branch
 */
export async function getSuggestedVideos(
  studentId: string,
  studentClass: string,
  studentBranch?: string,
  limit = 6
) {
  if (!studentId || !studentClass) {
    return {
      success: false,
      message: !studentId ? "No student ID provided" : "No class provided",
    };
  }

  const supabase = await createClient();

  // Get applicable subjects for this student
  const applicableSubjects = getApplicableSubjects(studentClass, studentBranch);

  if (applicableSubjects.length === 0) {
    return {
      success: false,
      message:
        "No applicable subjects found for this student's class and branch",
    };
  }

  // Fetch videos only
  const videoQuery = supabase
    .from("videos")
    .select("*")
    .eq("class", studentClass)
    .in("subject", applicableSubjects)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (studentBranch && studentBranch !== "Tous") {
    videoQuery.eq("branch", studentBranch);
  }

  const { data: videos, error: videoError } = await videoQuery;

  if (videoError) {
    console.error("Error fetching videos:", videoError);
    return { success: false, message: "Failed to fetch videos" };
  }

  if (!videos || videos.length === 0) {
    return { success: false, message: "No relevant videos found" };
  }

  // Fetch teacher data separately
  const teacherIds = [...new Set(videos.map((v) => v.teacher_id))];

  const { data: teachers, error: teacherError } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_url")
    .in("id", teacherIds);

  if (teacherError) {
    console.error("Error fetching teachers:", teacherError);
    return {
      success: false,
      message: "Videos found, but failed to fetch teacher details",
      videos,
    };
  }

  // Merge teacher data into videos
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const enrichedVideos = videos.map((video) => ({
    ...video,
    teacher: teacherMap.get(video.teacher_id) || null,
  }));

  return {
    success: true,
    message: "Videos found",
    videos: enrichedVideos,
  };
}

/**
 *! Get suggested teachers for a student based on their class and branch
 */
export async function getSuggestedTeachers(
  studentId: string,
  studentClass: string,
  studentBranch?: string,
  limit = 6
) {
  if (!studentId || !studentClass) {
    return {
      success: false,
      message: !studentId ? "No student ID provided" : "No class provided",
    };
  }

  const supabase = await createClient();

  // Get applicable subjects for this student
  const applicableSubjects = getApplicableSubjects(studentClass, studentBranch);

  if (applicableSubjects.length === 0) {
    return {
      success: false,
      message:
        "No applicable subjects found for this student's class and branch",
    };
  }

  // Get applicable teacher specialties
  const applicableSpecialties = getApplicableSpecialties(applicableSubjects);

  if (applicableSpecialties.length === 0) {
    return {
      success: false,
      message: "No applicable teacher specialties found",
    };
  }

  // Find teachers with matching specialties
  const { data: teachers, error } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_url, specialties, bio")
    .contains("specialties", applicableSpecialties)
    .limit(limit);
  // .order("rating", { ascending: false })

  if (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, message: "Failed to fetch teachers" };
  }

  if (!teachers || teachers.length === 0) {
    return { success: false, message: "No relevant teachers found" };
  }

  return { success: true, message: "Teachers found", teachers };
}

/**
 * Get popular videos for a student based on their class and branch
 */
export async function getPopularVideos(
  studentClass: string,
  studentBranch?: string,
  limit = 6
) {
  if (!studentClass) {
    return { success: false, message: "No class provided" };
  }

  const supabase = await createClient();

  // Get applicable subjects for this class and branch
  const applicableSubjects = getApplicableSubjects(studentClass, studentBranch);

  if (applicableSubjects.length === 0) {
    return {
      success: false,
      message: "No applicable subjects found for this class and branch",
    };
  }

  // Fetch videos only
  const videoQuery = supabase
    .from("videos")
    .select("*")
    .eq("class", studentClass)
    .in("subject", applicableSubjects)
    .order("views", { ascending: false })
    .limit(limit);

  if (studentBranch && studentBranch !== "Tous") {
    videoQuery.eq("branch", studentBranch);
  }

  const { data: videos, error: videoError } = await videoQuery;

  if (videoError) {
    console.error("Error fetching popular videos:", videoError);
    return { success: false, message: "Failed to fetch popular videos" };
  }

  if (!videos || videos.length === 0) {
    return { success: false, message: "No popular videos found" };
  }

  // Fetch corresponding teachers separately
  const teacherIds = [...new Set(videos.map((v) => v.teacher_id))];

  const { data: teachers, error: teacherError } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_url, rating")
    .in("id", teacherIds);

  if (teacherError) {
    console.error("Error fetching teachers:", teacherError);
    return {
      success: false,
      message: "Videos found, but failed to fetch teacher details",
      videos,
    };
  }

  // Merge teacher info into each video
  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const enrichedVideos = videos.map((video) => ({
    ...video,
    teacher: teacherMap.get(video.teacher_id) || null,
  }));

  return {
    success: true,
    message: "Popular videos found",
    videos: enrichedVideos,
  };
}
/**
 * !Get videos for a specific subject
 */
export async function getSubjectVideos(
  subject: string,
  studentClass: string,
  studentBranch?: string,
  limit = 6
) {
  if (!subject || !studentClass) {
    return {
      success: false,
      message: !subject ? "No subject provided" : "No class provided",
    };
  }

  const supabase = await createClient();

  const applicableSubjects = getApplicableSubjects(studentClass, studentBranch);
  if (!applicableSubjects.includes(subject)) {
    return {
      success: false,
      message: `Subject ${subject} is not applicable for ${studentClass} ${
        studentBranch ?? ""
      }`,
    };
  }

  // Fetch videos only
  const videoQuery = supabase
    .from("videos")
    .select("*")
    .eq("class", studentClass)
    .eq("subject", subject)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (studentBranch && studentBranch !== "Tous") {
    videoQuery.eq("branch", studentBranch);
  }

  const { data: videos, error: videoError } = await videoQuery;

  if (videoError) {
    console.error("Error fetching videos:", videoError);
    return { success: false, message: "Failed to fetch subject videos" };
  }

  if (!videos || videos.length === 0) {
    return {
      success: false,
      message: `No videos found for ${subject} in ${studentClass} ${
        studentBranch || ""
      }`,
    };
  }

  // Fetch corresponding teachers
  const teacherIds = [...new Set(videos.map((v) => v.teacher_id))];
  const { data: teachers, error: teacherError } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_url, rating")
    .in("id", teacherIds);

  if (teacherError) {
    console.error("Error fetching teachers:", teacherError);
    return {
      success: false,
      message: "Videos found, but failed to fetch teacher details",
      videos,
    };
  }

  const teacherMap = new Map(teachers.map((t) => [t.id, t]));
  const enrichedVideos = videos.map((video) => ({
    ...video,
    teacher: teacherMap.get(video.teacher_id) || null,
  }));

  return {
    success: true,
    message: "Subject videos found",
    videos: enrichedVideos,
  };
}

// async function enrichVideosWithTeachers(videos: any[], supabase: SupabaseClient) {
//   const teacherIds = [...new Set(videos.map((v) => v.teacher_id))];

//   const { data: teachers, error } = await supabase
//     .from("profiles")
//     .select("id, first_name, last_name, profile_url, rating")
//     .in("id", teacherIds);

//   if (error) throw new Error("Failed to fetch teachers");

//   const teacherMap = new Map(teachers.map((t) => [t.id, t]));

//   return videos.map((video) => ({
//     ...video,
//     teacher: teacherMap.get(video.teacher_id) || null,
//   }));
// }
// export async function getSubjectVideos(
//   subject: string,
//   studentClass: string,
//   studentBranch?: string,
//   limit = 6
// ) {
//   if (!subject || !studentClass) {
//     return {
//       success: false,
//       message: !subject ? "No subject provided" : "No class provided",
//     };
//   }

//   const supabase = await createClient();

//   // Check if subject is applicable for this class and branch
//   const applicableSubjects = getApplicableSubjects(studentClass, studentBranch);
//   if (!applicableSubjects.includes(subject)) {
//     return {
//       success: false,
//       message: `Subject ${subject} is not applicable for ${studentClass} ${
//         studentBranch || ""
//       }`,
//     };
//   }

//   // Find videos matching class and the requested subject
//   const query = supabase
//     .from("videos")
//     .select(
//       `
//       *,
//       teacher:teacher_id(id, first_name, last_name, profile_url, rating)
//     `
//     )
//     .eq("class", studentClass)
//     .eq("subject", subject)
//     .order("created_at", { ascending: false })
//     .limit(limit);

//   // Add branch filter if provided
//   if (studentBranch && studentBranch !== "Tous") {
//     query.eq("branch", studentBranch);
//   }

//   const { data: videos, error } = await query;

//   if (error) {
//     console.error("Error fetching subject videos:", error);
//     return { success: false, message: "Failed to fetch subject videos" };
//   }

//   if (!videos || videos.length === 0) {
//     return {
//       success: false,
//       message: `No videos found for ${subject} in ${studentClass} ${
//         studentBranch || ""
//       }`,
//     };
//   }

//   return { success: true, message: "Subject videos found", videos };
// }
