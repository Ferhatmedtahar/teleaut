import PatientList from "../_components/studentsList/StudentsList";
import { getPatientsList } from "../_lib/admin";

export default async function StudentsListPage() {
  const { data: patients } = await getPatientsList();
  if (!patients) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">No Patients Found</h2>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <PatientList patients={patients} />
    </div>
  );
}
