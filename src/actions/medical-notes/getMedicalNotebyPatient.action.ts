"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/getCurrentUser.action";

export async function getDoctorNotes() {
  try {
    const supabase = await createClient();
    const { user } = await getCurrentUser();

    if (!user) {
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
        message: "Accès non autorisé",
      };
    }

    // Fetch all medical notes created by this doctor
    const { data: medicalNotes, error: notesError } = await supabase
      .from("medical_notes")
      .select(
        `
        id,
        doctor_id,
        patient_id,
        appointment_id,
        content,
        created_at,
        patient:users!medical_notes_patient_id_fkey(
          id,
          first_name,
          last_name,
          email
        ),
        appointment:appointments(
          id,
          appointment_date,
          status
        )
      `
      )
      .eq("doctor_id", user.id)
      .order("created_at", { ascending: false });

    if (notesError) {
      console.error("Error fetching doctor notes:", notesError);
      return {
        success: false,
        message: "Erreur lors de la récupération des notes médicales",
      };
    }

    return {
      success: true,
      data: medicalNotes || [],
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
}

export async function getPatientNotes(patientId: string) {
  try {
    const supabase = await createClient();

    const { user } = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Non authentifié",
      };
    }

    if (user.role === "patient" && user.id !== patientId) {
      return {
        success: false,
        message: "Accès non autorisé",
      };
    }

    const { data: notes, error: notesError } = await supabase
      .from("medical_notes")
      .select(
        `
        id,
        doctor_id,
        patient_id,
        appointment_id,
        content,
        created_at,
        doctor:users!medical_notes_doctor_id_fkey(
          id,
          first_name,
          last_name,
          email,
          specialty
        ),
        appointment:appointments(
          id,
          appointment_date,
          status
        )
      `
      )
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false });

    if (notesError) {
      console.error("Error fetching patient notes:", notesError);
      return {
        success: false,
        message: "Erreur lors de la récupération des notes médicales",
      };
    }

    return {
      success: true,
      data: notes || [],
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      message: "Une erreur inattendue est survenue",
    };
  }
}
