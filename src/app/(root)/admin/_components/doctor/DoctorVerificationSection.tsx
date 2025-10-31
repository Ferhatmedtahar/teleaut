import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import VerifyDoctorButton from "./verify-doctor-button";

export default async function DoctorVerificationActions({
  doctor,
}: {
  doctor: any;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Actions</CardTitle>
        <CardDescription>
          Review the doctor&apos;s documents and verify their account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {doctor.verification_status === VERIFICATION_STATUS.APPROVED && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
            This teacher has already been approved and is now fully verified to
            access the platform.
          </div>
        )}

        {doctor.verification_status === VERIFICATION_STATUS.EMAIL_SENT && (
          <div className="bg-blue-50 text-blue-700 dark:text-primary dark:bg-background border border-border/40  p-3 rounded-md text-sm">
            A verification email has been sent to the doctor&apos;s registered
            email address. Please wait for them to complete the process.
          </div>
        )}

        {doctor.verification_status === VERIFICATION_STATUS.REJECTED && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            This doctor&apos;s profile has been reviewed and rejected. Please
            contact support for further clarification.
          </div>
        )}

        {doctor.verification_status === VERIFICATION_STATUS.PENDING && (
          <div className="bg-yellow-50 text-yellow-700 p-3 rounded-md text-sm">
            This doctor is currently under review and waiting to be approved by
            an administrator.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <VerifyDoctorButton
          doctorId={doctor.id}
          doctorEmail={doctor.email}
          verificationStatus={doctor.verification_status}
        />
      </CardFooter>
    </Card>
  );
}
