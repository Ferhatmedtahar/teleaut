import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getMedicalNotesByPatient } from "@/actions/notes/getMedicalNotesByPatient.action";
import { getDoctorNotes } from "@/actions/notes/getDoctorNotes.action";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import MedicalNotesList from "./_components/MedicalNotesList";

export const metadata = {
  title: "Notes Médicales",
  description: "Gérer les notes médicales",
};

export default async function MedicalNotesPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  let notes = [];

  if (user.role === roles.doctor) {
    const result = await getDoctorNotes();
    if (result.success) {
      notes = result.data || [];
    }
  } else if (user.role === roles.patient) {
    const result = await getMedicalNotesByPatient(user.id);
    if (result.success) {
      notes = result.data || [];
    }
  }

  const isDoctor = user.role === roles.doctor;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {isDoctor ? "Notes Médicales" : "Mes Notes Médicales"}
        </h1>
        <p className="text-muted-foreground">
          {isDoctor
            ? "Créez et gérez les notes médicales de vos patients"
            : "Consultez vos notes médicales"}
        </p>
      </div>

      <MedicalNotesList notes={notes} isDoctor={isDoctor} />
    </div>
  );
}
