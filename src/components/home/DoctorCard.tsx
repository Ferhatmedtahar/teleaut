import { Doctor } from "@/types/entities/Doctor.interface";
import { Hospital, Mail, MapPinCheck, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../common/buttons/Button";

function DoctorCard({ doctor }: { readonly doctor: Doctor }) {
  const doctorName = `${doctor.first_name} ${doctor.last_name}`;
  const initials = doctorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header section with avatar and name */}
        <div className="flex items-center space-x-4 mb-6">
          {/* Avatar with profile image or initials fallback */}
          <div className="w-14 h-14 bg-gray-100 dark:bg-primary-700 rounded-full flex items-center justify-center overflow-hidden relative">
            {doctor.profile_url ? (
              <Image
                src={doctor.profile_url}
                alt={`Photo de Dr. ${doctorName}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            ) : (
              <span className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
                {initials}
              </span>
            )}
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
            <Hospital className="w-4 h-4 mr-3 text-gray-500" />
            <span>{doctor?.specialty}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPinCheck className="w-4 h-4 mr-3 text-gray-500" />
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

export default DoctorCard;
// import { Doctor } from "@/types/entities/Doctor.interface";
// import { Hospital, Mail, MapPinCheck, Phone } from "lucide-react";
// import Link from "next/link";
// import { Button } from "../common/buttons/Button";

// function DoctorCard({ doctor }: { readonly doctor: Doctor }) {
//   const doctorName = `${doctor.first_name} ${doctor.last_name}`;
//   const initials = doctorName
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();

//   return (
//     <div className=" border  rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
//       <div className="p-6">
//         {/* Header section with avatar and name */}
//         <div className="flex items-center space-x-4 mb-6">
//           {/* Simple avatar */}
//           <div className="w-14 h-14 bg-gray-100 dark:bg-primary-700 rounded-full flex items-center justify-center">
//             <span className="text-gray-700 dark:text-gray-200 font-semibold text-lg">
//               {initials}
//             </span>
//           </div>

//           {/* Name and basic info */}
//           <div className="flex-1">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Dr. {doctorName}
//             </h3>
//             <p className="text-sm text-gray-600 dark:text-gray-400">Médecin</p>
//           </div>
//         </div>

//         {/* Contact information */}
//         <div className="space-y-3 mb-6">
//           <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//             <Mail className="w-4 h-4 mr-3 text-gray-500" />
//             <span className="truncate">{doctor.email}</span>
//           </div>

//           <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//             <Hospital className="w-4 h-4 mr-3 text-gray-500" />
//             <span>{doctor?.specialty}</span>
//           </div>

//           <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//             <MapPinCheck className="w-4 h-4 mr-3 text-gray-500" />
//             <span>{doctor.location}</span>
//           </div>

//           <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
//             <Phone className="w-4 h-4 mr-3 text-gray-500" />
//             <span>{doctor.phone_number}</span>
//           </div>
//         </div>

//         {/* Action button */}
//         <Link href={`/appointments/${doctor.id}`} className="block">
//           <Button variant="default" className="w-full">
//             Prendre rendez-vous
//           </Button>
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default DoctorCard;
