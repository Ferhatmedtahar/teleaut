"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
  createMedicalNoteSchema,
  updateMedicalNoteSchema,
  type CreateMedicalNoteInput,
  type UpdateMedicalNoteInput,
} from "../../app/(root)/medical-notes/_components/forms/MedicalNotesSchema";

export async function createMedicalNote(data: CreateMedicalNoteInput) {
  try {
    const supabase = await createClient();

    // Get current user (doctor)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "Non authentifié",
      };
    }

    // Validate user is a doctor
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userError || userData?.role !== "doctor") {
      return {
        success: false,
        message: "Seuls les médecins peuvent créer des notes médicales",
      };
    }

    // Validate input
    const validation = createMedicalNoteSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Données invalides",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const validatedData = validation.data;

    // Verify patient exists
    const { data: patient, error: patientError } = await supabase
      .from("users")
      .select("id, role")
      .eq("id", validatedData.patient_id)
      .single();

    if (patientError || !patient || patient.role !== "patient") {
      return {
        success: false,
        message: "Patient non trouvé",
      };
    }

    // If appointment_id is provided, verify it exists and belongs to this doctor/patient
    if (validatedData.appointment_id) {
      const { data: appointment, error: appointmentError } = await supabase
        .from("appointments")
        .select("id")
        .eq("id", validatedData.appointment_id)
        .eq("doctor_id", user.id)
        .eq("patient_id", validatedData.patient_id)
        .single();

      if (appointmentError || !appointment) {
        return {
          success: false,
          message: "Rendez-vous non trouvé ou non autorisé",
        };
      }
    }

    // Create medical note
    const { data: note, error: insertError } = await supabase
      .from("medical_notes")
      .insert({
        doctor_id: user.id,
        patient_id: validatedData.patient_id,
        appointment_id: validatedData.appointment_id || null,
        content: validatedData.content,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating medical note:", insertError);
      return {
        success: false,
        message: "Erreur lors de la création de la note médicale",
      };
    }

    revalidatePath("/medical-notes");
    return {
      success: true,
      message: "Note médicale créée avec succès",
      data: note,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
}

export async function updateMedicalNote(data: UpdateMedicalNoteInput) {
  try {
    const supabase = await createClient();

    // Get current user (doctor)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        message: "Non authentifié",
      };
    }

    // Validate input
    const validation = updateMedicalNoteSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        message: "Données invalides",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const validatedData = validation.data;

    // Verify note exists and belongs to this doctor
    const { data: existingNote, error: fetchError } = await supabase
      .from("medical_notes")
      .select("id, doctor_id")
      .eq("id", validatedData.id)
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
        message: "Non autorisé à modifier cette note",
      };
    }

    // Update medical note
    const { data: updatedNote, error: updateError } = await supabase
      .from("medical_notes")
      .update({
        content: validatedData.content,
      })
      .eq("id", validatedData.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating medical note:", updateError);
      return {
        success: false,
        message: "Erreur lors de la mise à jour de la note médicale",
      };
    }

    revalidatePath("/medical-notes");
    return {
      success: true,
      message: "Note médicale mise à jour avec succès",
      data: updatedNote,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
}
