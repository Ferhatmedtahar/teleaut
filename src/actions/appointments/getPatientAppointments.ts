"use server";
"use server";

import { createClient } from "@/lib/supabase/server";

export async function getPatientAppointments(patientId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
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

export async function getDoctorAppointments(doctorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("doctor_id", doctorId)
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
