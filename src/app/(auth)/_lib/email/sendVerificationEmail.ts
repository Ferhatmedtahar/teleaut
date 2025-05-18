"use server";

import { sendVerificationEmailTeacher } from "@/app/(auth)/_lib/email/sendApprovaleEmailTeacher";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface HandleVerificationEmailOptions {
  updateUser?: boolean;
}

export async function handleVerificationEmail(
  teacherId: string,
  email: string,
  verify: boolean,
  options: HandleVerificationEmailOptions = {}
) {
  if (!teacherId) {
    return { success: false, message: "Teacher ID is required" };
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("id,verification_status")
    .eq("id", teacherId)
    .single();
  // console.log(data, "data hello HELLOP");
  if (
    !data ||
    typeof data.id !== "string" ||
    typeof data.verification_status !== "string"
  ) {
    return { success: false, message: "Teacher not found" };
  }
  const { verification_status } = data;

  if (
    verification_status == VERIFICATION_STATUS.APPROVED ||
    verification_status == VERIFICATION_STATUS.REJECTED
  ) {
    return { success: false, message: "Teacher already verified" };
  }

  const token = await generateToken({ id: teacherId, role: "teacher" });

  const { emailSent, message } = await sendVerificationEmailTeacher(
    teacherId,
    email,
    token
  );

  if (!emailSent) {
    return { success: false, message };
  }

  if (options.updateUser) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("users")
      .update({
        verification_status: verify && VERIFICATION_STATUS.EMAIL_SENT,
      })
      .eq("id", teacherId)
      .eq("role", "teacher");

    if (error) {
      console.error("Error updating teacher verification status:", error);
      return {
        success: false,
        message: "Failed to update verification status",
      };
    }
  }

  revalidatePath(`/admin/teachers/${teacherId}`);
  revalidatePath("/admin/unverified");
  revalidatePath("/admin");

  return {
    success: true,
    message: options.updateUser
      ? "Approval email sent successfully"
      : "Approval email resent successfully",
  };
}
