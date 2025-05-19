import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getUserById } from "@/actions/profile/getUserById.action";
import { roles } from "@/types/roles.enum";
import { redirect } from "next/navigation";
import ErrorProfile from "../_components/ErrorProfile";
import ProfileContent from "../_components/profileByid/ProfileContent";
import VisitorsProfile from "../_components/profileByid/visitorsTeacher/VisitorsProfile";

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
