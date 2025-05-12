import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { roles } from "@/types/roles.enum";
import { UserProps } from "@/types/UserProps";
import Image from "next/image";
import EditProfileButton from "../EditProfileButton";
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
  const profileUrl = user?.profile_url;
  const background_cover = user?.background_url;

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
          <p className="text-background text-sm capitalize bg-[#355869] w-fit px-3 py-1 rounded-md">
            {role}
          </p>
        </div>
        <div className="mt-4 border rounded-md p-4">
          <p className="text-sm font-medium">{bio}</p>

          {/* <Textarea
            className="border-none p-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
            // placeholder="Bio will be here"
            defaultValue=""
            rows={3}
          /> */}
        </div>
      </div>
    </div>
  );
}
