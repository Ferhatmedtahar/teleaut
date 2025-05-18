import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { CheckCircle, Clock, Mail, XCircle } from "lucide-react";
import { getTeacherById } from "../../_lib/admin";

export default function TeacherProfile({
  teacher,
}: {
  readonly teacher: NonNullable<Awaited<ReturnType<typeof getTeacherById>>>;
}) {
  // console.log("teacher admin profile", teacher);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={teacher.profile_url ?? ""}
            alt={`${teacher.first_name} ${teacher.last_name}`}
          />
          <AvatarFallback className="text-lg">
            {teacher.first_name[0]}
            {teacher.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {teacher.first_name} {teacher.last_name}
          </CardTitle>
          <CardDescription>{teacher.email}</CardDescription>
          {teacher.phone_number && (
            <CardDescription>{teacher.phone_number}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.specialties
                ? teacher.specialties.map((specialty: string) => (
                    <Badge key={specialty}>{specialty}</Badge>
                  ))
                : null}
            </div>
          </div>

          {teacher.bio && (
            <div>
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-sm text-muted-foreground">{teacher.bio}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Account Status</h3>
            <div className="flex items-center gap-2">
              {teacher.verification_status === VERIFICATION_STATUS.APPROVED && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified</span>
                </>
              )}
              {teacher.verification_status ===
                VERIFICATION_STATUS.EMAIL_SENT && (
                <div className="flex items-center gap-2 p-1 bg-blue-50 rounded-sm">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm  text-blue-600">
                    Verification email sent
                  </span>
                </div>
              )}

              {teacher.verification_status === VERIFICATION_STATUS.REJECTED && (
                <div className="flex items-center gap-2 p-1 bg-red-50 rounded-sm">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm  text-red-600">Rejected</span>
                </div>
              )}

              {teacher.verification_status === VERIFICATION_STATUS.PENDING && (
                <div className="flex items-center gap-2 p-1 bg-yellow-50 rounded-sm">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm  text-yellow-600">Pending</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
