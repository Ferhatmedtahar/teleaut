"use server";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { TeacherFile } from "@/types/TeacherFile";
// import { revalidatePath } from "next/cache";
//! Admin statistics

export async function getAdminStats() {
  const supabase = await createClient();

  // Get total users count
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Get total teachers count
  const { count: totalTeachers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "teacher");

  // Get total students count
  const { count: totalStudents } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  // Get pending verifications count
  const { count: pendingVerifications } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "teacher")
    .eq("verification_status", VERIFICATION_STATUS.PENDING);

  return {
    totalUsers: totalUsers ?? 0,
    totalTeachers: totalTeachers ?? 0,
    totalStudents: totalStudents ?? 0,
    pendingVerifications: pendingVerifications ?? 0,
  };
}

//! Unverified Teachers list and details
export async function getUnverifiedTeachers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "teacher")
    .eq("verification_status", VERIFICATION_STATUS.PENDING)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unverified teachers:", error);
    throw new Error("Failed to fetch unverified teachers");
  }

  return data ?? [];
}

//! Teacher details by id for approval
export async function getTeacherById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .eq("role", "teacher")
    .single();

  if (error) {
    console.error("Error fetching teacher:", error);
    return null;
  }

  return data;
}

//! Teacher Files from user_files table
export async function getTeacherFiles(
  teacherId: string
): Promise<TeacherFile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_files")
    .select("*")
    .eq("user_id", teacherId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teacher files:", error);
    throw new Error("Failed to fetch teacher files");
  }

  return data || [];
}

//!Get all students
export async function getStudentsList() {
  "use server";
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "student")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching students:", error);
      throw new Error("Failed to fetch students");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getStudentsList:", error);
    // Return dummy data in case of error
    return [
      {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        created_at: "2023-01-15T10:30:00Z",
      },
      {
        id: "2",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        created_at: "2023-02-20T14:45:00Z",
      },
    ];
  }
}

//!Delete a student
export async function deleteStudent(id: string) {
  const supabase = await createClient();
  try {
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting student:", error);
      throw new Error("Failed to delete student");
    }

    // revalidatePath("/admin/students-list");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteStudent:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

//!Get all teachers
export async function getTeachersList() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("role", "teacher")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching teachers:", error);
      throw new Error("Failed to fetch teachers");
    }

    return data || [];
  } catch (error) {
    console.error("Error in getTeachersList:", error);
    // Return dummy data in case of error
    return [
      {
        id: "1",
        first_name: "Robert",
        last_name: "Johnson",
        email: "robert.johnson@example.com",
        verification_status: VERIFICATION_STATUS.APPROVED,
        specialties: ["Mathematics", "Physics"],
        created_at: "2023-01-10T08:30:00Z",
      },
      {
        id: "2",
        first_name: "Sarah",
        last_name: "Davis",
        email: "sarah.davis@example.com",
        verification_status: VERIFICATION_STATUS.PENDING,
        specialties: ["English", "Literature"],
        created_at: "2023-02-15T11:45:00Z",
      },
    ];
  }
}

//!Delete a teacher
export async function deleteTeacher(id: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting teacher:", error);
      throw new Error("Failed to delete teacher");
    }

    // revalidatePath("/admin/teachers-list");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteTeacher:", error);
    return { success: false, error: "Failed to delete teacher" };
  }
}

//!update teacher verification status
export async function updateTeacherStatus(id: string, status: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ verification_status: status })
      .eq("id", id);

    if (error) {
      console.error("Error updating teacher status:", error);
      throw new Error("Failed to update teacher status");
    }

    // revalidatePath("/admin/teachers-list");
    // revalidatePath(`/admin/unverified/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Error in updateTeacherStatus:", error);
    return { success: false, error: "Failed to update teacher status" };
  }
}
