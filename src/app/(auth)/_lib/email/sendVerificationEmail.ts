"use server";

import { sendVerificationEmailTeacher } from "@/app/(auth)/_lib/email/sendApprovaleEmailTeacher";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { revalidatePath } from "next/cache";

interface HandleVerificationEmailOptions {
  updateUser?: boolean;
}

export async function handleVerificationEmail(
  doctorId: string,
  email: string,
  verify: boolean,
  options: HandleVerificationEmailOptions = {}
) {
  if (!doctorId) {
    return {
      success: false,
      message: "L'identifiant de l'enseignant est requis",
    };
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from("users")
    .select("id,verification_status")
    .eq("id", doctorId)
    .single();

  if (
    !data ||
    typeof data.id !== "string" ||
    typeof data.verification_status !== "string"
  ) {
    return { success: false, message: "Enseignant non trouvé" };
  }
  const { verification_status } = data;

  if (
    verification_status == VERIFICATION_STATUS.APPROVED ||
    verification_status == VERIFICATION_STATUS.REJECTED
  ) {
    return { success: false, message: "Enseignant déjà vérifié" };
  }

  const token = await generateToken({ id: doctorId, role: roles.doctor });

  const { emailSent, message } = await sendVerificationEmailTeacher(
    doctorId,
    email,
    token
  );

  if (!emailSent) {
    return { success: false, message };
  }

  if (options.updateUser) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("users")
      .update({
        verification_status: verify && VERIFICATION_STATUS.EMAIL_SENT,
      })
      .eq("id", doctorId)
      .eq("role", roles.doctor);

    if (error) {
      console.error("Error updating teacher verification status:", error);
      return {
        success: false,
        message: "Échec de la mise à jour du statut de vérification",
      };
    }
  }

  revalidatePath(`/admin/doctors/${doctorId}`);
  revalidatePath("/admin/unverified");
  revalidatePath("/admin");

  return {
    success: true,
    message: options.updateUser
      ? "E-mail d'approbation envoyé avec succès"
      : "L'e-mail d'approbation a été renvoyé avec succès",
  };
}
