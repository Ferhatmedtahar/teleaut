"use server";

import { SignUpSchema } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import { sendVerificationEmail } from "@/app/(auth)/_lib/email/sendVerificationEmailStudents";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
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
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      console.error("User already exists");
      return { success: false, message: "L'e-mail est déjà enregistré." };
    }

    const hashedPassword = await hashPassword(password);

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
        verification_status: VERIFICATION_STATUS.PENDING,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError || !newUser) {
      console.error(insertError);
      return {
        success: false,
        message: "Échec de la création de l'utilisateur.",
      };
    }

    //!generate token and send email server action call
    const token = await generateToken({ id: newUser.id, role: "student" });

    const { emailSent, message } = await sendVerificationEmail(
      newUser.id,
      newUser.email,
      token
    );

    if (!emailSent) {
      //$Rollback user creation
      await supabase.from("users").delete().eq("id", newUser.id);
      return { success: false, message };
    }

    return { success: true, token, message: "Utilisateur créé avec succès." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Une erreur inattendue s'est produite." };
  }
}
