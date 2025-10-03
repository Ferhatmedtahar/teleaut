import { notFound } from "next/navigation";
import { getDoctorById } from "../../_lib/admin";

import DoctorProfile from "./DoctorProfile";
import DoctorVerificationActions from "./DoctorVerificationSection";

export default async function DoctorDetailsContent({
  doctorId,
}: {
  readonly doctorId: string;
}) {
  const { success, doctor } = await getDoctorById(doctorId);

  if (!doctor) {
    notFound();
  }
  console.log("doctor", doctor);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <DoctorProfile doctor={doctor} />
        <DoctorVerificationActions doctor={doctor} />
      </div>
    </div>
  );
}
