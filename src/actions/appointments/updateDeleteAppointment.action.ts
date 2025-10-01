"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/getCurrentUser.action";

type UpdateAppointmentParams = {
  id: string;
  appointment_date?: string;
  note?: string | null;
};

export async function updateAppointment({
  id,
  appointment_date,
  note,
}: UpdateAppointmentParams): Promise<{
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
      .select("patient_id, status")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return {
        success: false,
        message: "Rendez-vous non trouvé",
      };
    }

    // Verify the user is the patient who created this appointment
    if (appointment.patient_id !== user.id) {
      return {
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce rendez-vous",
      };
    }

    // Validate the appointment date if provided
    if (appointment_date) {
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
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (appointment_date !== undefined) {
      updateData.appointment_date = appointment_date;
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

    return {
      success: true,
      message: "Rendez-vous mis à jour avec succès",
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return {
      success: false,
      message: "Erreur lors de la mise à jour du rendez-vous",
    };
  }
}

export async function deleteAppointment(id: string): Promise<{
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
      .select("patient_id")
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return {
        success: false,
        message: "Rendez-vous non trouvé",
      };
    }

    // Verify the user is the patient who created this appointment
    if (appointment.patient_id !== user.id) {
      return {
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer ce rendez-vous",
      };
    }

    // Delete the appointment
    const { error: deleteError } = await supabase
      .from("appointments")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting appointment:", deleteError);
      return {
        success: false,
        message: "Erreur lors de la suppression du rendez-vous",
      };
    }

    return {
      success: true,
      message: "Rendez-vous supprimé avec succès",
    };
  } catch (error) {
    console.error("Error deleting appointment:", error);
    return {
      success: false,
      message: "Erreur lors de la suppression du rendez-vous",
    };
  }
}
