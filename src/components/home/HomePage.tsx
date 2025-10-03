import { getDoctorsList } from "@/actions/home/getDoctors.action";
import DoctorCard from "./DoctorCard";

export default async function HomePage() {
  //fetch the doctors and appointments made by the user
  //  await getHomePageVideos();
  // await getBranchAndClass();
  const { success, doctors } = await getDoctorsList();

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="dark:text-primary-50/80   ">
            Impossible de charger les vidéos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg ">
      <div>banner</div>
      <div>appointment</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {doctors && doctors?.length > 0 ? (
          doctors.map((doctor) => {
            return <DoctorCard key={doctor.id} doctor={doctor} />;
          })
        ) : (
          <div>no doctors</div>
        )}
      </div>
    </div>
  );
}
