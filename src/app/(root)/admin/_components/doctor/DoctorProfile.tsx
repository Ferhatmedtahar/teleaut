import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { CheckCircle, Clock, Mail, XCircle } from "lucide-react";

export default function DoctorProfile({
  doctor,
}: {
  doctor: any;
  // readonly {doctor}: NonNullable<Awaited<ReturnType<typeof getDoctorById>>>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={doctor.profile_url ?? ""}
            alt={`${doctor.first_name} ${doctor.last_name}`}
          />
          <AvatarFallback className="text-lg">
            {doctor.first_name[0]}
            {doctor.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {doctor.first_name} {doctor.last_name}
          </CardTitle>
          <CardDescription>{doctor.email}</CardDescription>
          {doctor.phone_number && (
            <CardDescription>{doctor.phone_number}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* <div>
            <h3 className="font-medium mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {doctor.specialties
                ? teacher.specialties.map((specialty: string) => (
                    <Badge key={specialty}>{specialty}</Badge>
                  ))
                : null}
            </div>
          </div> */}

          {doctor.bio && (
            <div>
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-sm text-muted-foreground">{doctor.bio}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Account Status</h3>
            <div className="flex items-center gap-2">
              {doctor.verification_status === VERIFICATION_STATUS.APPROVED && (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified</span>
                </>
              )}
              {doctor.verification_status ===
                VERIFICATION_STATUS.EMAIL_SENT && (
                <div className="flex items-center gap-2 p-1 bg-background rounded-sm">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <span className="text-sm  text-blue-600">
                    Verification email sent
                  </span>
                </div>
              )}

              {doctor.verification_status === VERIFICATION_STATUS.REJECTED && (
                <div className="flex items-center gap-2 p-1 bg-red-50 rounded-sm">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-sm  text-red-600">Rejected</span>
                </div>
              )}

              {doctor.verification_status === VERIFICATION_STATUS.PENDING && (
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
