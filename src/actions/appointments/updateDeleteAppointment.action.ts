"use server";

import { sendAppointmentConfirmationEmail } from "@/app/(auth)/_lib/email/sendAcceptenceAppPatient";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "../auth/getCurrentUser.action";

type UpdateAppointmentParams = {
  id: string;
  appointment_date?: string;
  note?: string | null;
  status?: string;
};

export async function updateAppointment({
  id,
  appointment_date,
  note,
  status,
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

    // Get the appointment with patient and doctor details
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select(
        `
        *,
        patient:users!appointments_patient_id_fkey(id, email, full_name),
        doctor:users!appointments_doctor_id_fkey(id, full_name, specialty)
      `
      )
      .eq("id", id)
      .single();

    if (fetchError || !appointment) {
      return {
        success: false,
        message: "Rendez-vous non trouvé",
      };
    }

    // Check if user is authorized (patient or doctor)
    const isPatient = appointment.patient_id === user.id;
    const isDoctor = appointment.doctor_id === user.id;

    if (!isPatient && !isDoctor) {
      return {
        success: false,
        message: "Vous n'êtes pas autorisé à modifier ce rendez-vous",
      };
    }

    // Patients can only update date and note for pending appointments
    if (isPatient) {
      const nonUpdatableStatuses = ["completed", "confirmed", "rejected"];
      if (nonUpdatableStatuses.includes(appointment.status)) {
        return {
          success: false,
          message: "Modification non autorisée pour ce rendez-vous",
        };
      }

      // Patients cannot update status
      if (status !== undefined) {
        return {
          success: false,
          message: "Vous n'êtes pas autorisé à modifier le statut",
        };
      }
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

    if (status !== undefined && isDoctor) {
      updateData.status = status;
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

    // Send email notification if doctor confirmed the appointment
    if (status === "confirmed" && isDoctor && appointment.patient) {
      try {
        await sendAppointmentConfirmationEmail(
          appointment.patient.id,
          appointment.patient.email,
          {
            appointment_date: appointment_date || appointment.appointment_date,
            doctor_name: appointment.doctor.full_name || "Votre médecin",
            doctor_specialty: appointment.doctor.specialty,
          }
        );
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
      }
    }

    return {
      success: true,
      message:
        status === "confirmed"
          ? "Rendez-vous confirmé avec succès. Le patient a été notifié par email."
          : "Rendez-vous mis à jour avec succès",
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

    // Get the appointment to verify ownership and status
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
        message: "Vous n'êtes pas autorisé à supprimer ce rendez-vous",
      };
    }

    // Check if appointment status allows deletion
    const nonDeletableStatuses = ["completed", "confirmed", "rejected"];
    if (nonDeletableStatuses.includes(appointment.status)) {
      return {
        success: false,
        message: "Suppression non autorisée pour ce rendez-vous",
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
// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { getCurrentUser } from "../auth/getCurrentUser.action";

// type UpdateAppointmentParams = {
//   id: string;
//   appointment_date?: string;
//   note?: string | null;
// };

// // export async function updateAppointment({
// //   id,
// //   appointment_date,
// //   note,
// // }: UpdateAppointmentParams): Promise<{
// //   success: boolean;
// //   message?: string;
// // }> {
// //   try {
// //     const supabase = await createClient();

// //     // Get the current user
// //     const { user } = await getCurrentUser();
// //     if (!user) {
// //       return {
// //         success: false,
// //         message: "Non authentifié",
// //       };
// //     }

// //     // Get the appointment to verify ownership
// //     const { data: appointment, error: fetchError } = await supabase
// //       .from("appointments")
// //       .select("patient_id, status")
// //       .eq("id", id)
// //       .single();

// //     if (fetchError || !appointment) {
// //       return {
// //         success: false,
// //         message: "Rendez-vous non trouvé",
// //       };
// //     }

// //     // Verify the user is the patient who created this appointment
// //     if (appointment.patient_id !== user.id) {
// //       return {
// //         success: false,
// //         message: "Vous n'êtes pas autorisé à modifier ce rendez-vous",
// //       };
// //     }

// //     const nonUpdatableStatuses = ["completed", "confirmed", "rejected"];
// //     if (nonUpdatableStatuses.includes(appointment.status)) {
// //       return {
// //         success: false,
// //         message: "Modification non autorisée pour ce rendez-vous",
// //       };
// //     }

// //     // Validate the appointment date if provided
// //     if (appointment_date) {
// //       const selectedDate = new Date(appointment_date);
// //       const tomorrow = new Date();
// //       tomorrow.setDate(tomorrow.getDate() + 1);
// //       tomorrow.setHours(0, 0, 0, 0);

// //       if (selectedDate < tomorrow) {
// //         return {
// //           success: false,
// //           message: "La date du rendez-vous doit être au minimum demain",
// //         };
// //       }
// //     }

// //     // Prepare update data
// //     const updateData: any = {
// //       updated_at: new Date().toISOString(),
// //     };

// //     if (appointment_date !== undefined) {
// //       updateData.appointment_date = appointment_date;
// //     }

// //     if (note !== undefined) {
// //       updateData.note = note || null;
// //     }

// //     // Update the appointment
// //     const { error: updateError } = await supabase
// //       .from("appointments")
// //       .update(updateData)
// //       .eq("id", id);

// //     if (updateError) {
// //       console.error("Error updating appointment:", updateError);
// //       return {
// //         success: false,
// //         message: "Erreur lors de la mise à jour du rendez-vous",
// //       };
// //     }

// //     return {
// //       success: true,
// //       message: "Rendez-vous mis à jour avec succès",
// //     };
// //   } catch (error) {
// //     console.error("Error updating appointment:", error);
// //     return {
// //       success: false,
// //       message: "Erreur lors de la mise à jour du rendez-vous",
// //     };
// //   }
// // }
// export async function deleteAppointment(id: string): Promise<{
//   success: boolean;
//   message?: string;
// }> {
//   try {
//     const supabase = await createClient();

//     // Get the current user
//     const { user } = await getCurrentUser();
//     if (!user) {
//       return {
//         success: false,
//         message: "Non authentifié",
//       };
//     }

//     // Get the appointment to verify ownership and status
//     const { data: appointment, error: fetchError } = await supabase
//       .from("appointments")
//       .select("patient_id, status")
//       .eq("id", id)
//       .single();

//     if (fetchError || !appointment) {
//       return {
//         success: false,
//         message: "Rendez-vous non trouvé",
//       };
//     }

//     // Verify the user is the patient who created this appointment
//     if (appointment.patient_id !== user.id) {
//       return {
//         success: false,
//         message: "Vous n'êtes pas autorisé à supprimer ce rendez-vous",
//       };
//     }

//     // Check if appointment status allows deletion
//     const nonDeletableStatuses = ["completed", "confirmed", "rejected"];
//     if (nonDeletableStatuses.includes(appointment.status)) {
//       return {
//         success: false,
//         message: "Suppression non autorisée pour ce rendez-vous",
//       };
//     }

//     // Delete the appointment
//     const { error: deleteError } = await supabase
//       .from("appointments")
//       .delete()
//       .eq("id", id);

//     if (deleteError) {
//       console.error("Error deleting appointment:", deleteError);
//       return {
//         success: false,
//         message: "Erreur lors de la suppression du rendez-vous",
//       };
//     }

//     return {
//       success: true,
//       message: "Rendez-vous supprimé avec succès",
//     };
//   } catch (error) {
//     console.error("Error deleting appointment:", error);
//     return {
//       success: false,
//       message: "Erreur lors de la suppression du rendez-vous",
//     };
//   }
// }
