import { getTeacherFiles } from "../../_lib/admin";
import { TeacherFiles } from "./TeacherFiles";

export default async function TeacherFilesContent({
  teacherId,
}: {
  readonly teacherId: string;
}) {
  const files = await getTeacherFiles(teacherId);

  return <TeacherFiles files={files} />;
}
