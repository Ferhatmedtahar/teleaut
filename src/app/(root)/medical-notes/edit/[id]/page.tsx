import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getMedicalNotesForEdit } from "@/actions/medical-notes/getDoctorPatients.action";
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
  const { note, error } = await getMedicalNotesForEdit(params.id, user.id);

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
