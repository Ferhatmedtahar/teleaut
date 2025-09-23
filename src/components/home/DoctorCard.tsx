import { Doctor } from "@/types/entities/Doctor.interface";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "../common/buttons/Button";

function DoctorCard({ doctor }: { readonly doctor: Doctor }) {
  console.log(doctor);
  const doctorName = `${doctor.first_name} ${doctor.last_name}`;
  const initials = doctorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className=" border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header section with avatar and name */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Simple avatar */}
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
              {initials}
            </span>
          </div>

          {/* Name and basic info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Dr. {doctorName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Médecin</p>
          </div>
        </div>

        {/* Contact information */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 mr-3 text-gray-500" />
            <span className="truncate">{doctor.email}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 mr-3 text-gray-500" />
            <span>{doctor.location}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 mr-3 text-gray-500" />
            <span>{doctor.phone_number}</span>
          </div>
        </div>

        {/* Action button */}
        <Link href={`/appointments/${doctor.id}`} className="block">
          <Button variant="default" className="w-full">
            Prendre rendez-vous
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default DoctorCard; // import { Doctor } from "@/types/entities/Doctor.interface";
// import Link from "next/link";
// import { Button } from "../common/buttons/Button";

// function DoctorCard({ doctor }: { readonly doctor: Doctor }) {
//   console.log(doctor);
//   const doctorName = `${doctor.first_name} ${doctor.last_name}`;
//   // const doctorSpecialty = doctor.specialty || "doctor";

//   return (
//     <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
//       <div className="flex items-center space-x-3">
//         <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
//           <span className="text-primary font-semibold text-lg">
//             {doctorName
//               .split(" ")
//               .map((n) => n[0])
//               .join("")
//               .toUpperCase()}
//           </span>
//         </div>
//         <div className="flex justify-between w-full">
//           <div>
//             <p className="font-semibold text-primary">{doctorName}</p>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {doctor.email}
//             </p>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {doctor.location}
//             </p>
//           </div>
//           <div className="flex flex-col gap-2 ">
//             <p>{doctor?.phone_number}</p>
//             <Link href={`/appointments/${doctor.id}`}>
//               <Button variant="default">Rendez-vous</Button>
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DoctorCard;
