import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import MedicalNoteForm from "../../_components/forms/MedicalNotesFormPatient";

export const metadata = {
  title: "Modifier une note médicale",
  description: "Modifier une note médicale existante",
};

interface EditMedicalNotePageProps {
  params: {
    id: string;
  };
}

export default async function EditMedicalNotePage({
  params,
}: EditMedicalNotePageProps) {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== roles.doctor) {
    redirect("/medical-notes");
  }

  const supabase = await createClient();

  // Fetch the medical note
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
    .eq("id", params.id)
    .eq("doctor_id", user.id)
    .single();

  if (error || !note) {
    redirect("/medical-notes");
  }

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Modifier la note médicale</h1>
        <p className="text-muted-foreground">
          Patient: {note.patient.first_name} {note.patient.last_name}
        </p>
      </div>

      <MedicalNoteForm
        initialData={{
          id: note.id,
          patient_id: note.patient_id,
          appointment_id: note.appointment_id,
          content: note.content,
        }}
        isEdit={true}
      />
    </div>
  );
}
