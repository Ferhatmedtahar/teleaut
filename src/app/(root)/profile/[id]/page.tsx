import { getUserById } from "@/actions/profile/getUserById.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import ErrorProfile from "../_components/ErrorProfile";
// import EditProfileButton from "../_components/EditProfileButton";

async function ProfileContent({ userId }: { readonly userId: string }) {
  const { user, success } = await getUserById(userId);
  if (!success) return <ErrorProfile />;

  // const { user: currentUser, success: userSuccess } = await getCurrentUser();
  // if (!userSuccess || typeof currentUser?.id !== "string")
  // return <ErrorProfile />;

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

export default async function Profile({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <ProfileContent userId={id} />
      {/* <SugguestionProfileStudent /> */}
    </div>
  );
}
