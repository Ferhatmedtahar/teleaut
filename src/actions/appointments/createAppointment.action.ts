"use server";

import { createClient } from "@/lib/supabase/server";

type CreateAppointmentParams = {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  note: string | null;
};

export async function createAppointment({
  patient_id,
  doctor_id,
  appointment_date,
  note,
}: CreateAppointmentParams): Promise<{
  success: boolean;
  message?: string;
  id?: string;
}> {
  try {
    // Validate the appointment date
    const selectedDate = new Date(appointment_date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (selectedDate < tomorrow) {
      return {
        success: false,
        message: "La date du rendez-vous doit être au minimum demain",
      };
    }

    const supabase = await createClient();

    // Check if the patient and doctor exist
    const { data: patientExists } = await supabase
      .from("users")
      .select("id")
      .eq("id", patient_id)
      .single();

    const { data: doctorExists } = await supabase
      .from("users")
      .select("id")
      .eq("id", doctor_id)
      .single();

    if (!patientExists) {
      return {
        success: false,
        message: "Patient non trouvé",
      };
    }

    if (!doctorExists) {
      return {
        success: false,
        message: "Médecin non trouvé",
      };
    }

    // Check if there's already an appointment for this patient with this doctor on the same date
    const { data: existingAppointment } = await supabase
      .from("appointments")
      .select("id")
      .eq("patient_id", patient_id)
      .eq("doctor_id", doctor_id)
      .eq("appointment_date", appointment_date)
      .eq("status", "pending")
      .single();

    if (existingAppointment) {
      return {
        success: false,
        message:
          "Vous avez déjà un rendez-vous en attente avec ce médecin pour cette date",
      };
    }

    // Create the appointment
    const appointmentData = {
      patient_id,
      doctor_id,
      appointment_date,
      note: note || null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("appointments")
      .insert(appointmentData)
      .select("id")
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      return {
        success: false,
        message: "Erreur lors de la création du rendez-vous",
      };
    }

    return {
      success: true,
      message: "Rendez-vous créé avec succès",
      id: data.id,
    };
  } catch (error) {
    console.error("Error creating appointment:", error);
    return {
      success: false,
      message: "Erreur lors de la création du rendez-vous",
    };
  }
}
