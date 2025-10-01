"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPatientAppointments(patientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      id,
      appointment_date,
      status,
      note,
      created_at,
      updated_at,
      doctor:doctor_id (
        id,
        first_name,
        last_name,
        email,
        phone_number,
        profile_url
      )
    `
    )
    .eq("patient_id", patientId)
    .order("appointment_date", { ascending: true });

  if (error) {
    console.error("Error fetching appointments:", error);
    return {
      success: false,
      message: "Erreur lors de la récupération des rendez-vous",
    };
  }

  return { success: true, data };
}
