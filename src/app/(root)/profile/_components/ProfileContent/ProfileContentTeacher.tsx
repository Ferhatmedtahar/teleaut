import { Badge } from "@/components/ui/badge";
import { roles } from "@/types/roles.enum";
import { UserProps } from "@/types/UserProps";
import ErrorProfile from "../ErrorProfile";
import BackgroundUser from "./BackgroundUser";
import ProfilePictureUser from "./ProfilePictureUser";

export default function ProfileContentTeacher({
  user,
  currentUserId,
}: {
  readonly user: UserProps;
  readonly currentUserId: string;
}) {
  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const role = user?.role;
  const specialties = user?.specialties;
  const bio = user?.bio ?? `Hi, i'm ${firstName} ${lastName}.`;

  const userId = user?.id;

  if (role in roles === false) return <ErrorProfile />;
  return (
    <div className="w-full p-3">
      {/* max-w-6xl mx-auto */}
      {/* Profile Banner and Info */}
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

      {/* Profile Info */}
      <div className="px-8 pt-10 pb-6 ">
        <div className="flex justify-between items-start ">
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-xl font-bold">
              {firstName} {lastName}
            </h1>

            <div className="flex flex-wrap gap-2">
              {specialties
                ? specialties.map((specialty: string) => (
                    <Badge key={specialty}>{specialty}</Badge>
                  ))
                : null}
            </div>
            {/* Bio Section */}
          </div>
          <p className="text-white/95 text-sm capitalize bg-[#355869] w-fit px-3 py-1 rounded-md">
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
