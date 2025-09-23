import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";
import { Suspense } from "react";
import DoctorDetailsContent from "../../_components/doctor/DoctorDetailsContent";
import { getDoctorById } from "../../_lib/admin";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const doctor = await getDoctorById(id);

  if (!doctor) {
    return {
      title: "Doctor Not Found",
    };
  }

  return {
    title: `Review: ${doctor.first_name} ${doctor.last_name}`,
  };
}

export default async function DoctorDetails({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Doctor Review</h2>
        <Button variant="outline" className="border-primary" asChild>
          <Link href="/admin/doctors-list">Back to List</Link>
        </Button>
      </div>

      <Suspense fallback={<div>Loading doctor details...</div>}>
        <DoctorDetailsContent doctorId={id} key={id} />
      </Suspense>
    </div>
  );
}
