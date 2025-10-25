"use server";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { Doctor } from "@/types/entities/Doctor.interface";
import { roles } from "@/types/roles.enum";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";
//! Admin statistics

export async function getAdminStats() {
  const supabase = await createClient();

  // Get total users count
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Get total teachers count
  const { count: totalDoctors } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", roles.doctor);

  // Get total students count
  const { count: totalPatients } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", roles.patient);

  // Get pending verifications count
  const { count: pendingVerifications } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", roles.doctor)
    .eq("verification_status", VERIFICATION_STATUS.PENDING);

  const { count: appointments } = await supabase
    .from("appointments")
    .select("*", { count: "exact", head: true });

  return {
    totalUsers: totalUsers ?? 0,
    totalDoctors: totalDoctors ?? 0,
    totalPatients: totalPatients ?? 0,
    pendingVerifications: pendingVerifications ?? 0,
    totalAppointments: appointments,
  };
}

//! Unverified Teachers list and details
export async function getUnverifiedTeachers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", roles.doctor)
    .eq("verification_status", VERIFICATION_STATUS.PENDING)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unverified teachers:", error);
    return [];
  }

  return data ?? [];
}

//! Teacher details by id for approval
export async function getDoctorById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .eq("role", roles.doctor)
    .single();

  if (error) {
    console.error("Error fetching doctor:", error);
    return { success: false, message: "Error fetching doctor" };
  }

  return { success: true, doctor: data };
}

//!Get all patients
export async function getPatientsList() {
  "use server";
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", roles.patient)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching students:", error);
      return {
        success: false,
        message: "Impossible de récupérer les étudiants",
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getStudentsList:", error);
    return { success: false, message: "Impossible de récupérer les étudiants" };
  }
}

//!Delete a student
export async function deleteStudent(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting student:", error);
      return {
        success: false,
        message: "Échec de la suppression de patient",
      };
    }

    revalidatePath("/admin/patients-list");
    return { success: true, message: "L'étudiant a été supprimé avec succès" };
  } catch (error) {
    console.error("Error in deleteStudent:", error);
    return { success: false, message: "Échec de la suppression de l'étudiant" };
  }
}
//!Get all teachers
export async function getDoctorsList(): Promise<{
  data?: Doctor[];
  success: boolean;
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", roles.doctor)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching teachers:", error);
      return {
        success: false,
        message: "Impossible de trouver des enseignants",
      };
    }

    return {
      success: true,
      message: "Les enseignants ont été récupérés avec succès",
      data: data || [],
    };
  } catch (error) {
    console.error("Error in getDoctorsList:", error);
    return { success: false, message: "Impossible de trouver des enseignants" };
  }
}

//!Delete a teacher
export async function deleteTeacher(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting teacher:", error);
      return {
        success: false,
        message: "Échec de la suppression de l'enseignant",
      };
    }
    revalidatePath("/admin/doctors-list");
    return {
      success: true,
      message: "L'enseignant a été supprimé avec succès",
    };
  } catch (error) {
    console.error("Error in deleteTeacher:", error);
    return {
      success: false,
      message: "Échec de la suppression de l'enseignant",
    };
  }
}

//! get all videos

export async function getVideosList() {
  "use server";
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching videos:", error);
      return { success: false, message: "Failed to fetch videos" };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error in getVideosList:", error);
    return { success: false, message: "Failed to fetch videos" };
  }
}

//! Delete a video
export async function deleteVideo(id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("videos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting video:", error);
      return { success: false, message: "Échec de la suppression de la vidéo" };
    }

    revalidatePath("/admin/videos-list");
    return { success: true, message: "Vidéo supprimée avec succès" };
  } catch (error) {
    console.error("Error in deleteVideo:", error);
    return { success: false, message: "Échec de la suppression de la vidéo" };
  }
}

//! Get video stats
export async function getAppointmentsStatsOverTime() {
  "use server";
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("appointments")
    .select("id, created_at");

  if (error) {
    console.error("Error fetching video stats:", error);
    return [];
  }

  // Group by month
  const statsByMonth: Record<string, number> = {};
  data?.forEach((appointments) => {
    const month = new Date(appointments.created_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    statsByMonth[month] = (statsByMonth[month] || 0) + 1;
  });

  // Format for Recharts
  const chartData = Object.entries(statsByMonth).map(([name, count]) => ({
    name,
    count,
  }));

  return chartData.sort(
    (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
  );
}
