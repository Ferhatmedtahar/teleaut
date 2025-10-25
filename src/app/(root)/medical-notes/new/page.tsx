import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import {
  getDoctorAppointments,
  getDoctorPatients,
} from "@/actions/medical-notes/getDoctorPatients.action";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import MedicalNoteForm from "../_components/forms/MedicalNotesFormPatient";

export const metadata = {
  title: "Créer une note médicale",
  description: "Créer une nouvelle note médicale pour un patient",
};

export default async function NewMedicalNotePage() {
  const { user } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== roles.doctor) {
    redirect("/medical-notes");
  }

  const patientsResult = await getDoctorPatients();
  const patients = patientsResult.success ? patientsResult.data : [];

  // Get doctor's appointments for linking
  const appointmentsResult = await getDoctorAppointments();
  const appointments = appointmentsResult.success
    ? appointmentsResult.data
    : [];

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Créer une note médicale</h1>
        <p className="text-muted-foreground">
          Créez une nouvelle note médicale pour un patient
        </p>
      </div>

      <MedicalNoteForm patients={patients || []} appointments={appointments} />
    </div>
  );
}
