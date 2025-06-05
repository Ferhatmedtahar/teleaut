"use server";
import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { handleVerificationEmail } from "@/app/(auth)/_lib/email/sendVerificationEmail";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";

export async function resendVerificationEmail(formData: FormData) {
  const { user } = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return {
      success: false,
      message: "You are not authorized to perform this action",
    };
  }
  const teacherId = formData.get("teacherId") as string;
  const email = formData.get("email") as string;
  const verify = formData.get("verify") === "true";

  return handleVerificationEmail(teacherId, email, verify, {
    updateUser: false,
  });
}
