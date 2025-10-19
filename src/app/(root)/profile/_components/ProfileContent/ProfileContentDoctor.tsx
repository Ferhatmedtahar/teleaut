import { Badge } from "@/components/ui/badge";
import { roles } from "@/types/roles.enum";
import { DoctorProps, PatientProps } from "@/types/UserProps";
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
  console.log("ProfileContentDoctor user:", user);
  const firstName = user?.first_name ?? "Utilisateur";
  const lastName = user?.last_name ?? "";
  const role = user?.role;

  const specialty = user?.specialty;
  const bio = user?.bio ?? `Bonjour, je suis ${firstName} ${lastName}.`;

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

      <div className="px-4 pt-8 pb-4  md:px-8 md:pt-10 md:pb-6 ">
        <div className="flex justify-between items-start ">
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-lg sm:text-xl font-bold">
              {firstName} {lastName}
            </h1>

            <div className="flex flex-wrap gap-2">
              {specialty ? <Badge>{specialty}</Badge> : null}
            </div>
            {/* Bio Section */}
          </div>
          <p className="text-white/95 text-sm capitalize bg-primary w-fit px-3 py-1 rounded-md">
            {role}
          </p>
        </div>
        <div className="mt-4 border rounded-md p-4">
          <p className="text-sm font-medium">{bio}</p>
        </div>
      </div>
    </div>
  );
}
