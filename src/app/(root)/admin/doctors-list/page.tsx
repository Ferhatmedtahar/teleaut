import DoctorsList from "../_components/DoctorsList/DoctorsList";
import { getDoctorsList } from "../_lib/admin";

export default async function TeachersListPage() {
  const { data: doctors } = await getDoctorsList();
  if (!doctors)
    return (
      <p className="text-muted-foreground flex-center">Doctors not found</p>
    );
  return <DoctorsList doctors={doctors} />;
}
