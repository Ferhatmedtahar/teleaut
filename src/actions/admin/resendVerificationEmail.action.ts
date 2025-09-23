"use server";
import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { handleVerificationEmail } from "@/app/(auth)/_lib/email/sendVerificationEmail";

export async function resendVerificationEmail(formData: FormData) {
  const { user } = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return {
      success: false,
      message: "Vous n'êtes pas autorisé à effectuer cette action",
    };
  }
  const doctorId = formData.get("doctorId") as string;
  const email = formData.get("email") as string;
  const verify = formData.get("verify") === "true";

  return handleVerificationEmail(doctorId, email, verify, {
    updateUser: false,
  });
}
