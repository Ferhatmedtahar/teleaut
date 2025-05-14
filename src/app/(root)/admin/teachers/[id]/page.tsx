import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";
import { Suspense } from "react";
import TeacherDetailsContent from "../../_components/teacher/TeacherDetailsContent";
import { getTeacherById } from "../../_lib/admin";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teacher = await getTeacherById(id);

  if (!teacher) {
    return {
      title: "Teacher Not Found",
    };
  }

  return {
    title: `Review: ${teacher.first_name} ${teacher.last_name}`,
  };
}

export default async function TeacherDetails({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Teacher Review</h2>
        <Button variant="outline" className="border-primary" asChild>
          <Link href="/admin/teachers-list">Back to List</Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading teacher details...</div>}>
        <TeacherDetailsContent teacherId={id} key={id} />
      </Suspense>
    </div>
  );
}
