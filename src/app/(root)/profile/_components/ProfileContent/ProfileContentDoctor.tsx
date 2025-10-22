import { Badge } from "@/components/ui/badge";
import { roles } from "@/types/roles.enum";
import { DoctorProps } from "@/types/UserProps";
import {
  Briefcase,
  Calendar,
  DollarSign,
  GraduationCap,
  MapPin,
} from "lucide-react";
import ErrorProfile from "../ErrorProfile";
import BackgroundUser from "./BackgroundUser";
import ProfilePictureUser from "./ProfilePictureUser";

export default function ProfileContentDoctor({
  user,
  currentUserId,
}: {
  readonly user: DoctorProps;
  readonly currentUserId: string;
}) {
  const firstName = user?.first_name ?? "Utilisateur";
  const lastName = user?.last_name ?? "";
  const role = user?.role;

  const specialty = user?.specialty;
  const location = user?.location;
  const yearsOfExperience = user?.years_of_experience;
  const consultationFee = user?.consultation_fee;
  const education = user?.education;
  const availabilityTimes = user?.availability_times;
  const bio = user?.bio ?? `Bonjour, je suis ${firstName} ${lastName}.`;
  const email = user?.email;
  const userId = user?.id;

  if (role in roles === false) return <ErrorProfile />;

  return (
    <div className="w-full p-3">
      <div className="relative mb-6">
        <BackgroundUser
          firstName={firstName}
          lastName={lastName}
          role={role}
          bio={bio}
          profileUrl={user?.profile_url}
          background_cover={user?.background_url}
          userId={userId}
          currentUserId={currentUserId}
        />

        <ProfilePictureUser
          imageUrl={user?.profile_url}
          firstName={firstName}
          lastName={lastName}
        />
      </div>

      <div className="px-4 pt-8 pb-4 md:px-8 md:pt-10 md:pb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-lg sm:text-xl font-bold">
              Dr. {firstName} {lastName}
            </h1>

            <div className="flex flex-wrap gap-2">
              {specialty && <Badge className="text-sm">{specialty}</Badge>}
              {location && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {location}
                </Badge>
              )}

              {user.email && (
                <Badge variant="outline" className="text-sm">
                  {user.email}
                </Badge>
              )}
            </div>
          </div>
          <p className="text-white/95 text-sm capitalize bg-primary w-fit px-3 py-1 rounded-md">
            {role}
          </p>
        </div>

        {/* Bio Section */}
        <div className="mt-4 border rounded-md p-4">
          <h2 className="text-sm font-semibold mb-2">À propos</h2>
          <p className="text-sm text-muted-foreground  dark:text-white/90">
            {bio}
          </p>
        </div>

        {/* Professional Information Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Experience */}
          {yearsOfExperience !== undefined && (
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-4 h-4 text-primary " />
                <h3 className="text-sm font-semibold">Expérience</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-white/90">
                {yearsOfExperience} {yearsOfExperience > 1 ? "ans" : "an"}{" "}
                d'expérience
              </p>
            </div>
          )}

          {/* Consultation Fee */}
          {consultationFee !== undefined && (
            <div className="border rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Tarif de consultation</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-white/90">
                {consultationFee} DZD
              </p>
            </div>
          )}

          {/* Education */}
          {education && (
            <div className="border rounded-md p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Formation</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-white/90">
                {education}
              </p>
            </div>
          )}

          {/* Availability */}
          {availabilityTimes && (
            <div className="border rounded-md p-4 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">Disponibilité</h3>
              </div>
              <p className="text-sm text-muted-foreground dark:text-white/90">
                {availabilityTimes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
