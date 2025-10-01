import {
  getDoctorAppointments,
  getPatientAppointments,
} from "@/actions/appointments/getPatientAppointments";
import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { roles } from "@/types/roles.enum";
import AppointmentsPatientCard from "./_components/AppointmentsPatientCard";
import DoctorAppointmentsView from "./_components/doctorView/DoctorAppointmentView";

export const metadata = {
  title: "Mes Rendez-vous",
  description: "Gérer mes rendez-vous",
};

export default async function AppointmentsPage() {
  const { user } = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Vous devez être connecté pour voir cette page
          </p>
        </div>
      </div>
    );
  }

  let data;
  if (user.role !== roles.doctor) {
    data = await getPatientAppointments(user.id);
  } else {
    data = await getDoctorAppointments(user.id);
  }

  const { data: appointments, success } = data;

  if (!success) {
    return (
      <div className="mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Erreur lors de la récupération des rendez-vous
          </p>
        </div>
      </div>
    );
  }

  // Doctor View
  if (user.role === roles.doctor) {
    return <DoctorAppointmentsView appointments={appointments} />;
  }

  // Patient View
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Mes Rendez-vous
        </h1>
        <p className="text-gray-600">
          Consultez et gérez vos rendez-vous avec vos médecins
        </p>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment: any) => (
            <AppointmentsPatientCard
              key={appointment.id}
              appointment={appointment}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun rendez-vous trouvé
          </h3>
          <p className="text-gray-600">
            Vous n'avez pas encore de rendez-vous planifiés
          </p>
        </div>
      )}
    </div>
  );
}
// import {
//   getDoctorAppointments,
//   getPatientAppointments,
// } from "@/actions/appointments/getPatientAppointments";
// import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
// import { roles } from "@/types/roles.enum";
// import AppointmentsPatientCard from "./_components/AppointmentsPatientCard";
// // import FeaturedVideoUploadForm from "../_components/forms/AdminVideoUploadForm";
// // import VideoUploadForm from "../_components/forms/VideoUploadForm";

// export const metadata = {
//   title: "Ajouter une video",
//   description: "Ajouter une video",
// };
// export default async function AppointmentsPage() {
//   const { user } = await getCurrentUser();
//   // const result = await getCurrentUserById();
//   // const { user: currentUser } = result;
//   let data;
//   if (user?.role !== roles.doctor) {
//     data = await getPatientAppointments(user?.id!);
//   } else {
//     data = await getDoctorAppointments(user?.id!);
//   }
//   const { data: appointments, success } = data;
//   console.log("data", data);
//   if (!success) {
//     return (
//       <div className=" mx-auto p-8">
//         Erreur lors de la récupération des rendez-vous
//       </div>
//     );
//   }
//   if (user?.role == roles.doctor) {
//     return (
//       <div className=" mx-auto p-8">
//         {/**list of appointments from patinets! */}
//         list of appointments from patinets!
//         <pre>{JSON.stringify(appointments, null, 2)}</pre>
//       </div>
//     );
//   }

//   if (user?.role != roles.doctor)
//     return (
//       <div className=" mx-auto p-8">
//         {/**list of appointments he made! */}
//         list of appointments patient made!
//         <pre>{JSON.stringify(appointments, null, 2)}</pre>
//         {appointments && appointments.length > 0 ? (
//           appointments.map((appointment: any) => (
//             <AppointmentsPatientCard
//               key={appointment.id}
//               appointment={appointment}
//             />
//           ))
//         ) : (
//           <div>Aucun rendez-vous trouvé.</div>
//         )}
//       </div>
//     );
//   return <div className=" mx-auto p-8"></div>;
// }
