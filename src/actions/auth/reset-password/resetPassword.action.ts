"use server";

import { ResetPasswordSchema } from "@/app/(auth)/_components/forms/reset-password/resetPassword.schema";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";

export async function resetPassword(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const { password, confirmPassword } = await ResetPasswordSchema.parseAsync(
    data
  );
  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match" };
  }

  try {
    const hashedPassword = await hashPassword(password);
    const supabase = await createClient();

    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id, verification_status")
      .eq("id", data.id)
      .single();

    if (!existingUser) {
      console.error("User does not exist");
      return { success: false, message: "User does not exist." };
    }
    if (existingUser?.verification_status != VERIFICATION_STATUS.APPROVED) {
      console.error("User is not verified");
      return { success: false, message: "User is not verified." };
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: hashedPassword })
      .eq("id", data.id);
    if (updateError) {
      console.error(updateError);
      return { success: false, message: "Failed to update password" };
    }
    return { success: true, message: "Password updated successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to update password" };
  }
}
