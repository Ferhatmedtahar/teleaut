"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../auth/getCurrentUser.action";

export async function deleteMedicalNote(noteId: string) {
  try {
    const supabase = await createClient();

    // Get current user (doctor)
    const { user } = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Non authentifié",
      };
    }

    // Verify note exists and belongs to this doctor
    const { data: existingNote, error: fetchError } = await supabase
      .from("medical_notes")
      .select("id, doctor_id")
      .eq("id", noteId)
      .single();

    if (fetchError || !existingNote) {
      return {
        success: false,
        message: "Note médicale non trouvée",
      };
    }

    if (existingNote.doctor_id !== user.id) {
      return {
        success: false,
        message: "Non autorisé à supprimer cette note",
      };
    }

    const { error: deleteError } = await supabase
      .from("medical_notes")
      .delete()
      .eq("id", noteId);

    if (deleteError) {
      console.error("Error deleting medical note:", deleteError);
      return {
        success: false,
        message: "Erreur lors de la suppression de la note médicale",
      };
    }

    revalidatePath("/medical-notes");
    return {
      success: true,
      message: "Note médicale supprimée avec succès",
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
}
