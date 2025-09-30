import {
  getDoctorAppointments,
  getPatientAppointments,
} from "@/actions/appointments/getPatientAppointments";
import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { roles } from "@/types/roles.enum";
// import FeaturedVideoUploadForm from "../_components/forms/AdminVideoUploadForm";
// import VideoUploadForm from "../_components/forms/VideoUploadForm";

export const metadata = {
  title: "Ajouter une video",
  description: "Ajouter une video",
};
export default async function AppointmentsPage() {
  const { user } = await getCurrentUser();
  // const result = await getCurrentUserById();
  // const { user: currentUser } = result;
  let data;
  if (user?.role !== roles.doctor) {
    data = await getPatientAppointments(user?.id!);
  } else {
    data = await getDoctorAppointments(user?.id!);
  }
  const { data: appointments, success } = data;
  console.log("data", data);
  if (!success) {
    return (
      <div className=" mx-auto p-8">
        Erreur lors de la récupération des rendez-vous
      </div>
    );
  }
  if (user?.role == roles.doctor) {
    return (
      <div className=" mx-auto p-8">
        {/**list of appointments from patinets! */}
        list of appointments from patinets!
        <pre>{JSON.stringify(appointments, null, 2)}</pre>
      </div>
    );
  }

  if (user?.role == roles.patient)
    return (
      <div className=" mx-auto p-8">
        {/**list of appointments he made! */}
        list of appointments patient made!
        <pre>{JSON.stringify(appointments, null, 2)}</pre>
      </div>
    );
  return <div className=" mx-auto p-8"></div>;
}
