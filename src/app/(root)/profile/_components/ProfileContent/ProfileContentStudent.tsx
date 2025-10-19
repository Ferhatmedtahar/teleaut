import { PatientProps } from "@/types/UserProps";
import BackgroundUser from "./BackgroundUser";
import ProfilePictureUser from "./ProfilePictureUser";

export default async function ProfileContentStudent({
  user,
  currentUserId,
}: {
  readonly user: PatientProps;
  readonly currentUserId: string;
}) {
  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const role = user?.role ?? "student";

  const bio = user?.bio ?? `Bonjour, je suis ${firstName} ${lastName}.`;
  const userId = user?.id;

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

      {/* Profile Info */}
      <div className="px-8 pt-10 pb-6 ">
        <div className="flex justify-between items-start ">
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-xl font-bold">
              {firstName} {lastName}
            </h1>

            {/* Bio Section */}
          </div>
          <p className="text-background text-sm capitalize bg-background w-fit px-3 py-1 rounded-md">
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
