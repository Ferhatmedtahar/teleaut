"use server";

import { SignUpSchema } from "@/app/(auth)/_components/forms/signUp/SignUp.schema";
import { hashPassword } from "@/app/(auth)/_lib/hashComparePassword";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { uploadFile } from "@/lib/helpers/uploadFile";
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

    if (existingUser) {
      console.error("User already exists");
      return { success: false, message: "L'e-mail est déjà enregistré." };
    }

    if (!diplomeFile || !identityFileFront || !identityFileBack) {
      return {
        success: false,
        message: "Un ou plusieurs fichiers requis sont manquants.",
      };
    }

    const hashedPassword = await hashPassword(password);

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

    if (insertError || !newTeacher) {
      console.error(insertError);
      return {
        success: false,
        message: "Échec de la création de l'utilisateur.",
      };
    }

    newUserId = newTeacher.id;
    if (!newUserId) {
      return {
        success: false,
        message: "Échec de la création de l'utilisateur.",
      };
    }

    const uploads = await Promise.all([
      uploadFile(diplomeFile, "diploma", newUserId),
      uploadFile(identityFileFront, "idFront", newUserId),
      uploadFile(identityFileBack, "idBack", newUserId),
    ]);

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
      message:
        "Compte enseignant créé avec succès, en attente de vérification.",
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
    return { success: false, message: "Une erreur inattendue s'est produite." };
  }
}
