import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import VerifyTeacherButton from "../../_components/verify-teacher-button";
import { getTeacherById } from "../../_lib/admin";

export default async function TeacherVerificationActions({
  teacher,
}: {
  readonly teacher: NonNullable<Awaited<ReturnType<typeof getTeacherById>>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Actions</CardTitle>
        <CardDescription>
          Review the teacher's documents and verify their account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teacher.verification_status === VERIFICATION_STATUS.APPROVED ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            This teacher has already been approved.
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
            This teacher is waiting to be approved.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <VerifyTeacherButton
          teacherId={teacher.id}
          teacherEmail={teacher.email}
          isVerified={
            teacher.verification_status === VERIFICATION_STATUS.APPROVED
          }
        />
      </CardFooter>
    </Card>
  );
}
