import { roles } from "@/types/roles.enum";
import Image from "next/image";
import EditProfileButton from "../EditProfileButton";

export default function BackgroundUser({
  firstName,
  lastName,
  role,
  bio,
  profileUrl,
  background_cover,
  userId,
  currentUserId,
  classValue,
  branch,
}: {
  readonly firstName: string;
  readonly lastName: string;
  readonly role: string;
  readonly bio: string;
  readonly profileUrl: string;
  readonly background_cover: string;
  readonly userId: string;
  readonly currentUserId: string;
  readonly classValue?: string;
  readonly branch?: string;
}) {
  return (
    <>
      {background_cover ? (
        <div className="relative h-40 w-full rounded-t-lg overflow-hidden">
          <Image
            height={1920}
            width={1080}
            src={background_cover}
            alt={`background cover image for ${firstName} ${lastName}`}
            className="w-full h-50 object-cover rounded-t-lg"
          />

          {/* Edit button - only visible if current user is viewing their own profile */}
          <EditProfileButton
            userId={userId}
            currentUserId={currentUserId}
            userRole={role as roles.student}
            userData={{
              first_name: firstName,
              last_name: lastName,
              bio,
              profile_url: profileUrl,
              background_url: background_cover,
              class: classValue,
              branch: branch,
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
            userRole={role as roles.student}
            userData={{
              first_name: firstName,
              last_name: lastName,
              bio,
              profile_url: profileUrl,
              background_url: background_cover,
              class: classValue,
              branch: branch,
            }}
          />
        </div>
      )}
    </>
  );
}
