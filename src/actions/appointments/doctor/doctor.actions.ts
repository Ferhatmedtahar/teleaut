"use server";

import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { createClient } from "@/lib/supabase/server";

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "rejected"
  | "rescheduled"
  | "completed";

type UpdateDoctorAppointmentParams = {
  id: string;
  appointment_date?: string;
  status?: AppointmentStatus;
  note?: string | null;
};

export async function updateDoctorAppointment({
  id,
  appointment_date,
  status,
  note,
}: UpdateDoctorAppointmentParams): Promise<{
  success: boolean;
  message?: string;
}> {
  try {
    const supabase = await createClient();

    // Get the current user
    const { user } = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Non authentifié",
      };
    }

    // Get the appointment to verify ownership
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select("doctor_id, patient_id, status, appointment_date")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return {
        success: false,
        message: "Rendez-vous non trouvé",
      };
    }

    // Verify the user is the doctor for this appointment
    if (appointment.doctor_id !== user.id) {
      return {
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce rendez-vous",
      };
    }

    // Validate the appointment date if provided
    if (appointment_date) {
      const selectedDate = new Date(appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return {
          success: false,
          message: "La date du rendez-vous ne peut pas être dans le passé",
        };
      }
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (appointment_date !== undefined) {
      updateData.appointment_date = appointment_date;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (note !== undefined) {
      updateData.note = note || null;
    }

    // Update the appointment
    const { error: updateError } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id);

    if (updateError) {
      console.error("Error updating appointment:", updateError);
      return {
        success: false,
        message: "Erreur lors de la mise à jour du rendez-vous",
      };
    }

    // Get success message based on what was updated
    let successMessage = "Rendez-vous mis à jour avec succès";
    if (status) {
      const statusMessages: Record<AppointmentStatus, string> = {
        confirmed: "Rendez-vous confirmé avec succès",
        rejected: "Rendez-vous rejeté",
        completed: "Rendez-vous marqué comme terminé",
        rescheduled: "Rendez-vous reprogrammé avec succès",
        pending: "Rendez-vous mis en attente",
      };
      successMessage = statusMessages[status] || successMessage;
    }

    return {
      success: true,
      message: successMessage,
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du rendez-vous",
    };
  }
}
