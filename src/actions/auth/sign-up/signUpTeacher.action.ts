"use server";

import { SignUpSchema } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { uploadFile } from "@/app/(auth)/_lib/uploadFile";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server"; // adjust the path to your client
import { z } from "zod";
const TeacherSchema = SignUpSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
  specialties: true,
  password: true,
}).extend({
  diplomeFile: z.instanceof(File),
  identityFileFront: z.instanceof(File),
  identityFileBack: z.instanceof(File),
});

export async function signUpTeacher(formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  data.specialties = JSON.parse(data.specialties as string);
  let newUserId: string | null = null;
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
    } = await TeacherSchema.parseAsync(data);

    const supabase = await createClient();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    console.log(existingUser);
    if (existingUser) {
      console.error("User already exists");
      return { success: false, message: "Email is already registered." };
    }

    if (!diplomeFile || !identityFileFront || !identityFileBack) {
      return {
        success: false,
        message: "One or more required files are missing.",
      };
    }

    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);
    const { data: newTeacher, error: insertError } = await supabase
      .from("users")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phoneNumber,
        role,
        password: hashedPassword,
        specialties,
        verification_status: VERIFICATION_STATUS.PENDING,
        created_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    console.log("new teacher from server action ", newTeacher);
    if (insertError || !newTeacher) {
      console.error(insertError);
      return { success: false, message: "Failed to create user." };
    }

    newUserId = newTeacher.id;
    if (!newUserId) {
      return { success: false, message: "Failed to create user." };
    }

    const uploads = await Promise.all([
      uploadFile(diplomeFile, "diploma", newUserId),
      uploadFile(identityFileFront, "idFront", newUserId),
      uploadFile(identityFileBack, "idBack", newUserId),
    ]);

    console.log("Files uploaded and references stored.");

    await supabase
      .from("users")
      .update({
        diplome_url: uploads[0],
        id_front_url: uploads[1],
        id_back_url: uploads[2],
      })
      .eq("id", newTeacher.id);

    return {
      success: true,
      message: "Teacher account created successfully, awaiting verification.",
    };
  } catch (error) {
    console.error("error", error);
    const supabase = await createClient();
    if (newUserId) {
      console.error("Rolling back user creation...");
      await supabase.from("users").delete().eq("id", newUserId);
    }
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}
