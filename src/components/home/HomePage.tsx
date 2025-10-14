import { getDoctorsList } from "@/actions/home/getDoctors.action";
import { Calendar, FileText, Heart, MessageCircle } from "lucide-react";
import DoctorCard from "./DoctorCard";

export default async function HomePage() {
  const { success, doctors } = await getDoctorsList();

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="dark:text-primary-50/80">
            Impossible de charger les vidéos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 rounded-lg">
      <section
        // className="relative overflow-hidden bg-gradient-to-br from-[#1a4d5c] via-[#206b7a] to-[#2d8a94] text-white py-16 px-6"
        className="relative overflow-hidden bg-gradient-to-br from-[#1a4d5c] via-[#206b7a] to-[#2d8a94] dark:from-[hsl(177,85%,12%)] dark:via-[hsl(177,90%,15%)] dark:to-[hsl(177,95%,18%)] text-white py-16 px-6"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5fa89f] rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-5xl sm:text-6xl font-bold mb-2 tracking-tight">
              TeleAutism
            </h1>
            <div className="w-24 h-1 bg-[#5fa89f] mx-auto rounded-full"></div>
          </div>

          <p className="text-xl sm:text-2xl mb-6 text-blue-50 font-light leading-relaxed">
            Relier les familles et les professionnels de santé pour des soins
            spécialisés de l’autisme
          </p>

          <p className="text-base sm:text-lg mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Une plateforme de télésanté sécurisée conçue pour soutenir les
            enfants atteints de troubles du spectre autistique. Planifiez des
            rendez-vous, accédez aux dossiers médicaux et communiquez avec des
            spécialistes — tout cela dans un espace de confiance.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium">Prise de rendez-vous</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium">Dossiers médicaux</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium">Chat sécurisé</span>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <span className="text-sm font-medium">Soins spécialisés</span>
            </div>
          </div>
        </div>
      </section>
      <h1 className="px-6 text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
        Médecins
      </h1>
      <div className="px-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 py-2">
        {doctors && doctors?.length > 0 ? (
          doctors.map((doctor) => {
            return <DoctorCard key={doctor.id} doctor={doctor} />;
          })
        ) : (
          <div>Aucun médecin disponible</div>
        )}
      </div>
    </div>
  );
}

// import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
// import { getDoctorsList } from "@/actions/home/getDoctors.action";
// import { Calendar, FileText, Heart, MessageCircle } from "lucide-react";
// import DoctorCard from "./DoctorCard";

// export default async function HomePage() {
//   const { success, doctors } = await getDoctorsList();
//   const user = await getCurrentUser();
//   const isPatient = user?.user?.role === "patient";
//   if (!success) {
//     return (
//       <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
//           <p className="dark:text-primary-50/80   ">
//             Impossible de charger les vidéos. Veuillez réessayer plus tard.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 dark:bg-background/80 bg-background/80  rounded-lg ">
//       <section className="relative overflow-hidden bg-gradient-to-br from-[#1a4d5c] via-[#206b7a] to-[#2d8a94] text-white py-16 px-6">
//         <div className="absolute inset-0 opacity-10">
//           <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
//           <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#5fa89f] rounded-full blur-3xl"></div>
//         </div>

//         <div className="relative z-10 max-w-4xl mx-auto text-center">
//           <div className="mb-6">
//             <h1 className="text-5xl sm:text-6xl font-bold mb-2 tracking-tight">
//               TeleAustism
//             </h1>
//             <div className="w-24 h-1 bg-[#5fa89f] mx-auto rounded-full"></div>
//           </div>

//           <p className="text-xl sm:text-2xl mb-6 text-blue-50 font-light leading-relaxed">
//             Connecting families and healthcare professionals for specialized
//             autism care
//           </p>

//           <p className="text-base sm:text-lg mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
//             A secure telehealth platform designed to support children with
//             autism spectrum disorder. Schedule appointments, access medical
//             records, and communicate with specialists—all in one trusted space.
//           </p>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
//             <div className="flex flex-col items-center space-y-2">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                 <Calendar className="w-7 h-7 text-white" />
//               </div>
//               <span className="text-sm font-medium">Prise de Rendez-vous</span>
//             </div>

//             <div className="flex flex-col items-center space-y-2">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                 <FileText className="w-7 h-7 text-white" />
//               </div>
//               <span className="text-sm font-medium">Dossiers Médicaux</span>
//             </div>

//             <div className="flex flex-col items-center space-y-2">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                 <MessageCircle className="w-7 h-7 text-white" />
//               </div>
//               <span className="text-sm font-medium">Chat Sécurisé</span>
//             </div>

//             <div className="flex flex-col items-center space-y-2">
//               <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
//                 <Heart className="w-7 h-7 text-white" />
//               </div>
//               <span className="text-sm font-medium">Soins Spécialisés</span>
//             </div>
//           </div>
//         </div>
//       </section>
//       <h1 className=" px-6 text-2xl sm:text-3xl font-bold mb-2 tracking-tight ">
//         Doctors
//       </h1>
//       <div className=" px-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 py-2">
//         {doctors && doctors?.length > 0 ? (
//           doctors.map((doctor) => {
//             return <DoctorCard key={doctor.id} doctor={doctor} />;
//           })
//         ) : (
//           <div>no doctors</div>
//         )}
//       </div>
//     </div>
//   );
// }
