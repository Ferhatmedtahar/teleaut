import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getUserById } from "@/actions/profile/getUserById.action";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import ErrorProfile from "../_components/ErrorProfile";
import ProfileContent from "../_components/profileByid/ProfileContent";
import VisitorsProfile from "../_components/profileByid/visitorsTeacher/VisitorsProfile";
import { Metadata } from "next";
import { cache } from "react";

const getUser = cache(getUserById);
export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { user } = await getUser(id);

  return {
    title: `Profil de ${user.first_name} ${user?.last_name}`,
    description: user?.bio,
    authors: [
      {
        name: user.first_name ?? "Teacher",
      },
    ],
    openGraph: {
      title: `${user.first_name} | Cognacia`,
      description: user.bio,
      type: "article",
      url: `https://cognacia.vercel.app/profile/${user.id}`,
      publishedTime: user?.created_at,
      modifiedTime: user?.created_at,
      authors: [`https://cognacia.vercel.app/profile/${user.id}`],
      images: [
        {
          url: `${user?.profile_url}`,
          width: 1024,
          height: 576,
          alt: `${user.first_name} ${user?.last_name}`,
          type: "image/png",
        },
      ],
    },
  };
}
export default async function Profile({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user: visitedUser, success } = await getUserById(id);
  const { success: currentSuccess, user: currentUser } = await getCurrentUser();
  if (!currentSuccess || !currentUser?.id || !visitedUser || !success) {
    return <ErrorProfile />;
  }

  if (currentUser && id === currentUser.id) {
    return redirect("/profile");
  }

  return (
    <div>
      <ProfileContent user={visitedUser} currentUser={currentUser} />
      <VisitorsProfile
        currentUserId={currentUser.id}
        currentUserRole={currentUser.role}
        isTeacher={currentUser.role == roles.teacher}
        isStudent={currentUser.role == roles.student}
        visitedUser={visitedUser}
      />
    </div>
  );
}
