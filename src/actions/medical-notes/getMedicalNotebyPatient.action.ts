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

    // Get current user
    const { user } = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "Non authentifié",
      };
    }

    // Validate user is accessing their own notes or is a doctor
    if (user.role === "patient" && user.id !== patientId) {
      return {
        success: false,
        message: "Accès non autorisé",
      };
    }

    // Fetch medical notes for the patient
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
// "use server";

// import { createClient } from "@/lib/supabase/server";
// import { getCurrentUser } from "../auth/getCurrentUser.action";

// export async function getDoctorNotes() {
//   try {
//     const supabase = await createClient();
//     const { user } = await getCurrentUser();

//     if (!user) {
//       return {
//         success: false,
//         message: "Non authentifié",
//       };
//     }

//     // Validate user is a doctor
//     const { data: userData, error: userError } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (userError || userData?.role !== "doctor") {
//       return {
//         success: false,
//         message: "Accès non autorisé",
//       };
//     }

//     const { data: medicalNotes, error: notesError } = await supabase
//       .from("medical_notes")
//       .select(
//         `
//         patient:users!appointments_patient_id_fkey(
//           id,
//           first_name,
//           last_name,
//           email
//         )
//       `
//       )
//       .eq("doctor_id", user.id);

//     if (notesError) {
//       console.error("Error fetching doctor patients:", notesError);
//       return {
//         success: false,
//         message: "Erreur lors de la récupération des patients",
//       };
//     }

//     // Extract unique patients
//     const uniquePatients = medicalNotes
//       ?.map((app: any) => app.patient)
//       .filter(
//         (patient: any, index: number, self: any[]) =>
//           patient && index === self.findIndex((p: any) => p?.id === patient?.id)
//       );

//     return {
//       success: true,
//       data: uniquePatients || [],
//     };
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return {
//       success: false,
//       message: "Une erreur inattendue est survenue",
//     };
//   }
// }

// export async function getPatientNotes(patientId: string) {
//   try {
//     const supabase = await createClient();

//     // Get current user
//     const { user } = await getCurrentUser();

//     if (!user) {
//       return {
//         success: false,
//         message: "Non authentifié",
//       };
//     }

//     // Validate user is accessing their own notes or is a doctor
//     if (user.role === "patient" && user.id !== patientId) {
//       return {
//         success: false,
//         message: "Accès non autorisé",
//       };
//     }

//     if (user.role === "doctor") {
//       // Optionally, you could check if the doctor has this patient in their list
//       // For simplicity, we skip that check here
//     }

//     // Fetch medical notes for the patient
//     const { data: notes, error: notesError } = await supabase
//       .from("medical_notes")
//       .select(
//         `
//         id,
//         content,
//         created_at,
//         updated_at,
//         doctor:users!medical_notes_doctor_id_fkey(
//           id,
//           first_name,
//           last_name,
//           email
//         ),
//         appointment:appointments!medical_notes_appointment_id_fkey(
//           id,
//           appointment_date,
//           status
//         )
//       `
//       )
//       .eq("patient_id", patientId)
//       .order("created_at", { ascending: false });

//     if (notesError) {
//       console.error("Error fetching patient notes:", notesError);
//       return {
//         success: false,
//         message: "Erreur lors de la récupération des notes médicales",
//       };
//     }

//     return {
//       success: true,
//       data: notes || [],
//     };
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     return {
//       success: false,
//       message: "Une erreur inattendue est survenue",
//     };
//   }
// }
