import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getCurrentUserById } from "@/actions/profile/getCurrentUserById.action";
import { roles } from "@/types/roles.enum";
import { SuggestionList } from "@/types/UserProps";
import ErrorProfile from "./_components/ErrorProfile";
import ProfileContentAdmin from "./_components/ProfileContent/ProfileContentAdmin";
import ProfileContentStudent from "./_components/ProfileContent/ProfileContentStudent";
import ProfileContentTeacher from "./_components/ProfileContent/ProfileContentTeacher";
import SuggestionProfileStudentList from "./_components/stduentSugguestion/SugguestionProfileStudentList";
import TeacherVideosList from "./_components/TeacherVideosList";
export const metadata = {
  title: "Mon profil",
  description:
    "Accédez à votre profil personnel pour consulter vos informations, vos vidéos, vos suggestions ou vos paramètres, selon votre rôle.",
};
async function ProfileContent() {
  const {
    user,
    success,
  }: { user?: SuggestionList; success: boolean; message?: string } =
    await getCurrentUserById();

  const { user: currentUser, success: userSuccess } = await getCurrentUser();

  if (!success) return <ErrorProfile />;
  if (!userSuccess || typeof currentUser?.id !== "string") {
    return <ErrorProfile />;
  }

  //teacher profile
  if (user?.role == roles.doctor) {
    return (
      <>
        <ProfileContentTeacher user={user} currentUserId={currentUser.id} />
        <TeacherVideosList user={user} />
      </>
    );
  }

  //student profile
  if (user?.role == roles.patient) {
    return (
      <>
        <ProfileContentStudent user={user} currentUserId={currentUser.id} />
        <SuggestionProfileStudentList user={user} />
      </>
    );
  }

  //admin profile like the student because he has no videos
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
