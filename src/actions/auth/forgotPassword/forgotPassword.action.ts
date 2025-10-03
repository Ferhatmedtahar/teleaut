"use server";

import { sendResetPasswordEmail } from "@/app/(auth)/_lib/email/sendResetPasswordEmailUser";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server"; // adjust the path to your client
import { z } from "zod";

export async function forgotPassword(email: string) {
  try {
    const supabase = await createClient();
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, role ,verification_status")
      .eq("email", email)
      .single();

    if (!existingUser) {
      console.error("User does not exist");
      return { success: false, message: "User does not exist." };
    }

    if (existingUser?.verification_status != VERIFICATION_STATUS.APPROVED) {
      console.error("User is not verified");
      return { success: false, message: "User is not verified." };
    }

    //!generate token and send email server action call
    const token = await generateToken({
      id: existingUser.id,
      role: existingUser.role,
    });

    const { emailSent, message } = await sendResetPasswordEmail(
      existingUser.id,
      email,
      token
    );

    if (!emailSent) {
      return { success: false, message };
    }

    return { success: true, token, message: "User created successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}
