"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "./auth";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";

export async function verifyTeacher(formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const teacherId = formData.get("teacherId") as string;
  const verify = formData.get("verify") === "true";

  if (!teacherId) {
    throw new Error("Teacher ID is required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("users")
    .update({ verification_status: verify && VERIFICATION_STATUS.APPROVED })
    .eq("id", teacherId)
    .eq("role", "teacher");

  if (error) {
    console.error("Error updating teacher verification status:", error);
    throw new Error("Failed to update teacher verification status");
  }

  revalidatePath(`/admin/teachers/${teacherId}`);
  revalidatePath("/admin/unverified");
  revalidatePath("/admin");

  return { success: true };
}
