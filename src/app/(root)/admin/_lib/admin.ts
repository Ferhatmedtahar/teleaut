import { createClient } from "@/lib/supabase/server";

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
    .eq("is_verified", false);

  return {
    totalUsers: totalUsers || 0,
    totalTeachers: totalTeachers || 0,
    totalStudents: totalStudents || 0,
    pendingVerifications: pendingVerifications || 0,
  };
}

export async function getUnverifiedTeachers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "teacher")
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching unverified teachers:", error);
    throw new Error("Failed to fetch unverified teachers");
  }

  return data ?? [];
}

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

export async function getTeacherFiles(teacherId: string) {
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
