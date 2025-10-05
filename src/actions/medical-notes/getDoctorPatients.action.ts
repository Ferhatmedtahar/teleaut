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

    // Extract unique patients
    const uniquePatients = appointments
      ?.map((app: any) => app.patient)
      .filter(
        (patient, index, self) =>
          index === self.findIndex((p) => p.id === patient.id)
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
