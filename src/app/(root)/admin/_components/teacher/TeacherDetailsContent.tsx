import { Tabs, TabsContent } from "@/components/ui/tabs";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import TeacherFilesSkeleton from "../../_components/teacher/LoadingTeacher";
import { getTeacherById } from "../../_lib/admin";
import TeacherFilesContent from "./TeacherFilesContent";
import TeacherProfile from "./TeacherProfile";
import TeacherVerificationActions from "./TeacherVerificationAction";

export default async function TeacherDetailsContent({
  teacherId,
}: {
  readonly teacherId: string;
}) {
  const teacher = await getTeacherById(teacherId);

  if (!teacher) {
    notFound();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <TeacherProfile teacher={teacher} />
        <TeacherVerificationActions teacher={teacher} />
      </div>

      <div>
        <Tabs defaultValue="documents">
          {/* <TabsList className="mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList> */}
          <h2 className="text-2xl font-bold">Documents</h2>
          <TabsContent value="documents">
            <Suspense fallback={<TeacherFilesSkeleton />}>
              <TeacherFilesContent teacherId={teacherId} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
