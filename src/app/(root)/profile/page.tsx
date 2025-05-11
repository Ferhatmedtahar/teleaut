import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getCurrentUserById } from "@/actions/profile/getCurrentUserById.action";
import { roles } from "@/types/roles.enum";
import { UserProps } from "@/types/UserProps";
import ErrorProfile from "./_components/ErrorProfile";
import ProfileContentAdmin from "./_components/ProfileContent/ProfileContentAdmin";
import ProfileContentStudent from "./_components/ProfileContent/ProfileContentStudent";
import ProfileContentTeacher from "./_components/ProfileContent/ProfileContentTeacher";
import SugguestionProfileStudent from "./_components/SugguestionProfileStudent";
import TeacherVideos from "./_components/TeacherVideos";

async function ProfileContent() {
  const {
    user,
    success,
  }: { user?: UserProps; success: boolean; message?: string } =
    await getCurrentUserById();

  const { user: currentUser, success: userSuccess } = await getCurrentUser();

  if (!success) return <ErrorProfile />;
  if (!userSuccess || typeof currentUser?.id !== "string")
    return <ErrorProfile />;

  if (user?.role == roles.teacher) {
    return (
      <>
        <ProfileContentTeacher user={user} currentUserId={currentUser.id} />
        <TeacherVideos />
      </>
    );
  }
  if (user?.role == roles.student) {
    return (
      <>
        <ProfileContentStudent user={user} currentUserId={currentUser.id} />
        <SugguestionProfileStudent />
      </>
    );
  }
  if (user?.role == roles.admin) {
    return (
      <>
        <ProfileContentAdmin user={user} currentUserId={currentUser.id} />
        {/* <>here you can add any content to the admin profile</> */}
      </>
    );
  }
}

export default async function UserProfilePage() {
  return <ProfileContent />;
}
