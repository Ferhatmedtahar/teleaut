"use server";

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
  // const applicableSubjects = getApplicableSubjects(studentClass, studentBranch);
  // const applicableSubjectsLower = applicableSubjects.map((subject) => {
  // return subject.toLowerCase();
  // });

  const studentClassLower = studentClass.toLowerCase();
  // /* The commented out code block within the `getSuggestedVideos` function is checking if there are no applicable subjects found for the student's class and branch. If `applicableSubjects` array has a length of 0 (meaning no subjects were found), it would return an object with `success` set to `false` and a message stating that no applicable subjects were found for the student's class and branch. This code block is currently disabled as it is commented out, so it does not affect the functionality of the function. */
  if (applicableSubjects.length === 0) {
  //   return {
  //     success: false,
  //     message:
  //       "No applicable subjects found for this student's class and branch",
  //   };
  // }

  const videoQuery = supabase
    .from("videos")
    .select("*")
    .eq("class", studentClassLower)
    .in("subject", applicableSubjectsLower)
    .order("created_at", { ascending: false })
    .limit(limit);

  const { data: videos, error: videoError } = await videoQuery;

  if (videoError) {
    console.error("Error fetching videos:", videoError);
    return { success: false, message: "Failed to fetch videos" };
  }

  if (!videos || videos.length === 0) {
    return { success: false, message: "No relevant videos found" };
  }

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

  // Get applicable teacher specialties
  const applicableSpecialties =
    applicableSubjects.length > 0
      ? getApplicableSpecialties(applicableSubjects)
      : [];

  // If we have applicable specialties, find teachers with matching specialties
  if (applicableSpecialties.length > 0) {
    const { data: teachers, error } = await supabase
      .from("users")
      .select("id, first_name, last_name, profile_url, specialties")
      .eq("role", "teacher") // Ensure we only get teachers
      .overlaps("specialties", applicableSpecialties)
      .limit(limit);
    // .order("rating", { ascending: false })

    if (error) {
      console.error("Error fetching teachers:", error);
      return { success: false, message: "Failed to fetch teachers" };
    }

    if (teachers && teachers.length > 0) {
      return {
        success: true,
        message: "Teachers found",
        teachers,
        isRelevant: true,
      };
    }
  }

  const { data: fallbackTeachers, error: fallbackError } = await supabase
    .from("users")
    .select("id, first_name, last_name, profile_url, specialties")
    .eq("role", "teacher")
    .limit(4);

  if (fallbackError) {
    console.error("Error fetching fallback teachers:", fallbackError);
    return { success: false, message: "Failed to fetch teachers" };
  }

  if (!fallbackTeachers || fallbackTeachers.length === 0) {
    return { success: false, message: "No teachers found" };
  }

  return {
    success: true,
    message:
      applicableSubjects.length === 0
        ? "Showing general teachers (no specific subjects found for your class/branch)"
        : "Showing general teachers (no relevant specialists found)",
    teachers: fallbackTeachers,
    isRelevant: false, // Indicates these are general teachers, not specifically relevant
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
        studentBranch ?? ""
      }`,
    };
  }

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
