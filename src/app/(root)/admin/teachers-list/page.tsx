import TeachersList from "../_components/teacherList/TeachersList";
import { getTeachersList } from "../_lib/admin";

export default async function TeachersListPage() {
  const { data: teachers } = await getTeachersList();
  if (!teachers)
    return (
      <p className="text-muted-foreground flex-center">Teachers not found</p>
    );
  return <TeachersList teachers={teachers} />;
}
