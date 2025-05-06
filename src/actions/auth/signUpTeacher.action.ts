"use server";

import { SignUpSchema } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { createClient } from "@/lib/supabase/server"; // adjust the path to your client
import { z } from "zod";
const TeacherSchema = SignUpSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
  diplomeFile: true,
  identityFileFront: true,
  identityFileBack: true,
  specialties: true,
  password: true,
  confirmPassword: true,
});

export async function signUpTeacher(formData: FormData) {
  console.log("Start the server action");

  const data = Object.fromEntries(formData.entries());
  console.log(data);
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      diplomeFile,
      identityFileFront,
      identityFileBack,
      specialties,
      password,
      confirmPassword,
    } = await TeacherSchema.parseAsync(data);
    console.log(
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      diplomeFile,
      identityFileFront,
      identityFileBack,
      specialties,
      password,
      confirmPassword
    );

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
    const { data: newTeacher, error: insertError } = await supabase
      .from("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        password: hashedPassword,
        role,
        diplome: diplomeFile,
        card_identity_front: identityFileFront,
        card_identity_back: identityFileBack,
        specialties,
        is_verified: false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    console.log(newTeacher);
    if (insertError || !newTeacher) {
      console.error(insertError);
      return { success: false, message: "Failed to create user." };
    }

    return { success: true, message: "User created successfully." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}
