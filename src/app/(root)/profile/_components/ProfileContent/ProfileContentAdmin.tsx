import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { roles } from "@/types/roles.enum";
import { UserProps } from "@/types/UserProps";
import Image from "next/image";
import EditProfileButton from "../EditProfileButton";

export default async function ProfileContentAdmin({
  user,
  currentUserId,
}: {
  readonly user: UserProps;
  readonly currentUserId: string;
}) {
  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const role = user?.role ?? "student";

  const bio = user?.bio ?? `Hi, i'm ${firstName} ${lastName}.`;
  const profileUrl = user?.profile_url;
  const background_cover = user?.background_url;
  const userId = user?.id;

  return (
    <div className="w-full p-3">
      {/* max-w-6xl mx-auto */}
      {/* Profile Banner and Info */}
      <div className="relative mb-6">
        {/* Banner with gradient background */}
        {background_cover ? (
          <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
            <Image
              height={1920}
              width={1080}
              src={background_cover}
              alt={`background cover image for ${firstName} ${lastName}`}
              className="w-full h-50 object-cover rounded-t-lg"
            />

            <EditProfileButton
              userId={userId}
              currentUserId={currentUserId}
              userRole={role as roles.admin}
              userData={{
                first_name: firstName,
                last_name: lastName,
                bio,
                profile_url: profileUrl,
                background_url: background_cover,
              }}
            />
          </div>
        ) : (
          <div className="h-40 w-full rounded-t-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#355869] via-primary-700 to-green-600"></div>

            {/* Edit button - only visible if current user is viewing their own profile */}
            <EditProfileButton
              userId={userId}
              currentUserId={currentUserId}
              userRole={role as roles.admin}
              userData={{
                first_name: firstName,
                last_name: lastName,
                bio,
                profile_url: profileUrl,
                background_url: background_cover,
              }}
            />
          </div>
        )}

        {/* Profile Avatar */}
        <div className="absolute left-8 -bottom-12">
          <Avatar className="h-24 w-24 border-4 border-white">
            <AvatarImage
              src={`${profileUrl}`}
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback className="text-2xl">
              {firstName[0]}
              {lastName[0]}
            </AvatarFallback>
          </Avatar>
        </div>
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
          <p className="text-background text-sm capitalize bg-[#355869] w-fit px-3 py-1 rounded-md">
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
