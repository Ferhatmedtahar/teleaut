"use server";

import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { revalidatePath } from "next/cache";

export async function rejectDoctor(formData: FormData) {
  const { user } = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return {
      success: false,
      message: "Vous n'êtes pas autorisé à effectuer cette action",
    };
  }

  const doctorId = formData.get("doctorId") as string;

  if (!doctorId) {
    return {
      success: false,
      message: "L'identifiant de l'enseignant est requis",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("users")
    .update({ verification_status: VERIFICATION_STATUS.REJECTED })
    .eq("id", doctorId)
    .eq("role", roles.doctor);

  if (error) {
    console.error("Error rejecting teacher:", error);
    return { success: false, message: "Impossible de rejeter l'enseignant" };
  }

  revalidatePath(`/admin/doctors/${doctorId}`);
  revalidatePath("/admin/unverified");
  revalidatePath("/admin");

  return {
    success: true,
    message: "L'enseignant a été rejeté",
  };
}
