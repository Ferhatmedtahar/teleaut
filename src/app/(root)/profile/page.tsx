import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getUserById } from "@/actions/profile/getUserById.action";
import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import EditProfileButton from "./_components/EditProfileButton";
import ErrorProfile from "./_components/ErrorProfile";

async function ProfileContent() {
  const { user, success } = await getUserById();
  const { user: currentUser, success: userSuccess } = await getCurrentUser();
  if (!success) return <ErrorProfile />;
  if (!userSuccess || typeof currentUser?.id !== "string")
    return <ErrorProfile />;

  console.log("user", user);

  //based on the role take data if teacher or student ,  if admin take nothing basic info.

  const firstName = user?.first_name ?? "User";
  const lastName = user?.last_name ?? "";
  const role = user?.role ?? "student";
  const specialties = user?.specialties;
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

            {/* Edit button - only visible if current user is viewing their own profile */}
            <EditProfileButton
              userId={userId}
              currentUserId={currentUser.id}
              userRole={role}
              userData={{
                first_name: firstName,
                last_name: lastName,
                bio,
                profile_url: profileUrl,
                background_url: background_cover,
                class: user?.class,
                branch: user?.branch,
              }}
            />
          </div>
        ) : (
          <div className="h-40 w-full rounded-t-lg overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#355869] via-primary-700 to-green-600"></div>

            {/* Edit button - only visible if current user is viewing their own profile */}
            <EditProfileButton
              userId={userId}
              currentUserId={currentUser.id}
              userRole={role}
              userData={{
                first_name: firstName,
                last_name: lastName,
                bio,
                profile_url: profileUrl,
                background_url: background_cover,
                class: user?.class,
                branch: user?.branch,
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

export default async function UserProfilePage() {
  return (
    <div>
      <ProfileContent />
      <SugguestionProfileStudent />
    </div>
  );
}

function SugguestionProfileStudent() {
  // Mock data for recommended teachers
  const recommendedTeachers = [
    {
      id: 1,
      name: "Dr.Lana",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 2,
      name: "Dr.Joe",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 3,
      name: "Dr.Fae",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 4,
      name: "Dr.Zack",
      rating: 4.8,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 5,
      name: "Dr.Fred",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 6,
      name: "Dr.Lia",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 7,
      name: "Dr.Jack",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
    {
      id: 8,
      name: "Dr.Hana",
      rating: 4.9,
      specialty: "Specialty",
      image: "/images/placeholder.svg",
    },
  ];
  return (
    <div className="px-8 py-6">
      <h2 className="text-lg font-semibold mb-6">Explorer des professeur</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {recommendedTeachers.map((teacher) => (
          <Card
            key={teacher.id}
            className="overflow-hidden border-none shadow-sm"
          >
            <CardContent className="p-0">
              <div className="flex flex-col items-center p-4">
                <Avatar className="h-16 w-16 mb-2">
                  <AvatarImage
                    src={teacher.image || "/placeholder.svg"}
                    alt={teacher.name}
                  />
                  <AvatarFallback>
                    {teacher.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <h3 className="font-medium">{teacher.name}</h3>
                    <div className="flex items-center text-yellow-500">
                      <Star className="fill-yellow-500 stroke-yellow-500 h-3 w-3" />
                      <span className="text-xs ml-0.5">{teacher.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">
                    {teacher.specialty}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs h-8"
                  >
                    apprendre
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
