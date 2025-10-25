import DoctorsList from "../_components/DoctorsList/DoctorsList";
import { getDoctorsList } from "../_lib/admin";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";
// Alternatively, you can use:
// export const revalidate = 0;

export default async function DoctorsListPage() {
  const { data: doctors } = await getDoctorsList();

  if (!doctors) {
    return (
      <p className="text-muted-foreground flex-center">Doctors not found</p>
    );
  }

  return <DoctorsList doctors={doctors} />;
}
