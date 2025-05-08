"use server";

import { SignUpSchema } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import { sendVerificationEmail } from "@/app/(auth)/_lib/email/sendVerificationEmailStudents";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { createClient } from "@/lib/supabase/server"; // adjust the path to your client
import { z } from "zod";
const StudentSchema = SignUpSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
  branch: true,
  class: true,
  password: true,
  confirmPassword: true,
});

export async function signUpStudent(formData: FormData) {
  console.log("Start the server action");

  const data = Object.fromEntries(formData.entries());
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      branch,
      class: studentClass,
      password,
    } = await StudentSchema.parseAsync(data);

    // Check if user exists

    const supabase = await createClient();
    const { data: existingUser, error: existingError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    console.log(existingUser);
    if (existingUser) {
      console.error("User already exists");
      return { success: false, message: "Email is already registered." };
    }

    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        phone_number: phoneNumber,
        role,
        class: studentClass,
        branch,
        is_verified: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log(newUser);
    if (insertError || !newUser) {
      console.error(insertError);
      return { success: false, message: "Failed to create user." };
    }

    //!generate token and send email server action call
    const token = await generateToken({ id: newUser.id, role: "student" });
    console.log(token);
    const emailSent = await sendVerificationEmail(newUser.email, token);
    console.log(emailSent);

    if (!emailSent) {
      //$Rollback user creation
      await supabase.from("users").delete().eq("id", newUser.id);
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
