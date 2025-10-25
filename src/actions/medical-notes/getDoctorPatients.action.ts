"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/getCurrentUser.action";

export async function getDoctorPatients() {
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

    // Get all unique patients who have appointments with this doctor
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select(
        `
        patient_id,
        patient:users!appointments_patient_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
      )
      .eq("doctor_id", user.id);

    if (appointmentsError) {
      console.error("Error fetching doctor patients:", appointmentsError);
      return {
        success: false,
        message: "Erreur lors de la récupération des patients",
      };
    }

    // Extract unique patients and filter out null values
    const uniquePatients = appointments
      ?.map((app: any) => app.patient)
      .filter((patient: any) => patient !== null)
      .filter(
        (patient: any, index: number, self: any[]) =>
          index === self.findIndex((p: any) => p?.id === patient?.id)
      );

    return {
      success: true,
      data: uniquePatients || [],
    };
  } catch (error) {
    console.error("Error in getDoctorPatients:", error);
    return {
      success: false,
      message: "Erreur serveur",
    };
  }
}

export async function getDoctorAppointments() {
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

    // Get all appointments for this doctor
    const { data: appointments, error: appointmentsError } = await supabase
      .from("appointments")
      .select(
        `
        id,
        patient_id,
        appointment_date,
        status,
        patient:users!appointments_patient_id_fkey(
          id,
          first_name,
          last_name
        )
      `
      )
      .eq("doctor_id", user.id)
      .in("status", ["confirmed", "completed"])
      .order("appointment_date", { ascending: false });

    if (appointmentsError) {
      console.error("Error fetching doctor appointments:", appointmentsError);
      return {
        success: false,
        message: "Erreur lors de la récupération des rendez-vous",
      };
    }

    return {
      success: true,
      data: appointments || [],
    };
  } catch (error) {
    console.error("Error in getDoctorAppointments:", error);
    return {
      success: false,
      message: "Erreur serveur",
    };
  }
}

export async function getMedicalNotesForEdit(id: string, userId: string) {
  const supabase = await createClient();

  const { data: note, error } = await supabase
    .from("medical_notes")
    .select(
      `
        *,
        patient:users!medical_notes_patient_id_fkey(
          id,
          first_name,
          last_name,
          email
        )
      `
    )
    .eq("id", id)
    .eq("doctor_id", userId)
    .single();
  return { note, error };
}
