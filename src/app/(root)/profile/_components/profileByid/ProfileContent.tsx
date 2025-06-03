import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { roles } from "@/types/roles.enum";
import { User } from "@/types/User";
import { UserProps } from "@/types/UserProps";
import Image from "next/image";
import ErrorProfile from "../ErrorProfile";
import ContactButton from "./ContactButton";
import FollowButton from "./FollowButton";

export default function ProfileContent({
  user,

  currentUser,
}: {
  readonly user: UserProps;

  readonly currentUser: User;
}) {
  if (!currentUser?.id || !currentUser?.role) return <ErrorProfile />;

  //based on the role take data if teacher or student ,  if admin take nothing basic info.

  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const role = user?.role ?? "student";
  const specialties = user?.specialties;
  const bio = user?.bio ?? `Hi, i'm ${firstName} ${lastName}.`;
  const profileUrl = user?.profile_url;
  const background_cover = user?.background_url;

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
          </div>
        ) : (
          <div className="h-40 w-full rounded-t-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#355869] via-primary-700 to-green-600"></div>
          </div>
        )}

        {/* Profile Avatar */}
        <div className="absolute left-8 -bottom-12">
          <Avatar className="h-24 w-24 border-4 border-white  dark:border-border/90">
            <AvatarImage
              src={`${profileUrl}`}
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback className="text-2xl  ">
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

            <div className="flex flex-wrap gap-2">
              {specialties
                ? specialties.map((specialty: string) => (
                    <Badge key={specialty}>{specialty}</Badge>
                  ))
                : null}
            </div>
            {/* Bio Section */}
          </div>
          <p className="dark:text-white text-background text-sm capitalize bg-[#355869] w-fit px-3 py-1 rounded-md">
            {role}
          </p>
        </div>
        <div className="mt-4 border border-border/20 dark:border-border/60 rounded-md p-4">
          <p className="text-sm font-medium ">{bio}</p>
        </div>

        {user.role == roles.teacher && currentUser.role != roles.teacher && (
          <div className="mt-4 flex flex-col items-center w-full sm:w-auto  sm:flex-row gap-2 ">
            <FollowButton />
            <ContactButton />
          </div>
        )}
      </div>
    </div>
  );
}
