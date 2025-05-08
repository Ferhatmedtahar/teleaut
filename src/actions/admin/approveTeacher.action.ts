"use server";
import { sendVerificationEmail } from "@/app/(auth)/_lib/email/sendVerificationEmailStudents";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function signUpTeacher(user: { id: string; email: string }) {
  try {
    const supabase = await createClient();
    //!generate token and send email server action call
    const token = await generateToken({ id: user.id, role: "teacher" });
    console.log(token);
    const emailSent = await sendVerificationEmail(user.email, token);
    console.log(emailSent);

    if (!emailSent) {
      //$Rollback user creation
      await supabase.from("users").delete().eq("id", user.id);
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
