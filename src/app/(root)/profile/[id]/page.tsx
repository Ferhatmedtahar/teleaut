import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getUserById } from "@/actions/profile/getUserById.action";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cache } from "react";
import ErrorProfile from "../_components/ErrorProfile";
import ProfileContent from "../_components/profileByid/ProfileContent";

const getUser = cache(getUserById);
export async function generateMetadata({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { user } = await getUser(id);

  return {
    title: `Profil de ${user.first_name} ${user?.last_name} | Teleaustism`,
    description: user?.bio,
    authors: [
      {
        name: user.first_name ?? "Doctor",
      },
    ],
    openGraph: {
      title: `${user.first_name} | Teleaustism`,
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
  // if ("specialty" in visitedUser) return <ErrorProfile />;

  return (
    <div>
      <ProfileContent user={visitedUser} currentUser={currentUser} />
    </div>
  );
}
