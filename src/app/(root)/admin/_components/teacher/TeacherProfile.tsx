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
import { CheckCircle, XCircle } from "lucide-react";
import { getTeacherById } from "../../_lib/admin";

export default function TeacherProfile({
  teacher,
}: {
  readonly teacher: NonNullable<Awaited<ReturnType<typeof getTeacherById>>>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={teacher.profile_url || ""}
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
              {teacher.specialties &&
                teacher.specialties.map((specialty: string, index: number) => (
                  <Badge key={index}>{specialty}</Badge>
                ))}
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
              {teacher.verification_status === VERIFICATION_STATUS.APPROVED ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
