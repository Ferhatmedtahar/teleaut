import { getCurrentUserById } from "@/actions/profile/getCurrentUserById.action";
import { getDoctorById } from "../../admin/_lib/admin";
import AppointmentForm from "../_components/forms/AppointmentFormPatient";

export const metadata = {
  title: "Ajouter une appointment",
  description: "Ajouter une appointment",
};
export default async function createAppointmentPage({
  params,
}: {
  params: Promise<{ doctorid: string }>;
}) {
  const { doctorid } = await params;
  // const { user } = await getCurrentUser();
  const data = await getDoctorById(doctorid);
  const doctor = data?.doctor;
  const result = await getCurrentUserById();
  const { user: currentUser } = result;

  return (
    <div className=" mx-auto p-8">
      {/* <VideoUploadForm
        userId={currentUser.id}
        userSpecialties={currentUser.specialties}
      /> */}
      <AppointmentForm patientId={currentUser.id} doctor={doctor} />
    </div>
  );
}
