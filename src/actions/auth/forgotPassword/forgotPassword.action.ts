"use server";

import { sendResetPasswordEmail } from "@/app/(auth)/_lib/email/sendResetPasswordEmailUser";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { createClient } from "@/lib/supabase/server"; // adjust the path to your client
import { z } from "zod";

export async function forgotPassword(email: string) {
  // Check if user exists
  try {
    const supabase = await createClient();
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id, role")
      .eq("email", email)
      .single();

    console.log(existingUser);
    if (!existingUser) {
      console.error("User does not exist");
      return { success: false, message: "User does not exist." };
    }

    //!generate token and send email server action call
    const token = await generateToken({
      id: existingUser.id,
      role: existingUser.role,
    });
    console.log(token);
    const emailSent = await sendResetPasswordEmail(email, token);
    console.log(emailSent);

    if (!emailSent) {
      //$Rollback user creation
      // await supabase.from("users").delete().eq("id", existingUser.id);
      return { success: false, message: "Failed to send verification email." };
    }

    return { success: true, token, message: "User created successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}
