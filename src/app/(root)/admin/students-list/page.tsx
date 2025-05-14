import StudentsList from "../_components/studentsList/StudentsList";
import { getStudentsList } from "../_lib/admin";

export default async function StudentsListPage() {
  const { data: students } = await getStudentsList();
  if (!students) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">No Students Found</h2>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <StudentsList students={students} />
    </div>
  );
}
