// import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
// import { UserProps } from "@/types/UserProps";

// export default async function VisitorsProfile({
//   currentUserId,
//   currentUserRole,
//   isTeacher,
//   isStudent,
//   visitedUser,
// }: {
//   readonly currentUserId: string;
//   readonly currentUserRole: string;
//   readonly isTeacher: boolean;
//   readonly isStudent: boolean;
//   readonly visitedUser: UserProps;
// }) {
//   const { success, videos } = await getTeacherVideos(currentUserId);

//   return (
//     <div>
//       VisitorsProfile {currentUserId} {currentUserRole}
//       <p>isTeacher: {isTeacher.toString()}</p>
//       <p>isStudent: {isStudent.toString()}</p>
//       {visitedUser?.first_name}
//       {visitedUser?.id}
//       {visitedUser?.role}
//     </div>
//   );
// }
import SuggestionProfileStudentList from "@/app/(root)/profile/_components/stduentSugguestion/SugguestionProfileStudentList";
import { SuggestionList } from "@/types/UserProps";
import VideoListVisitor from "./VideoListVisitor";

export default async function VisitorsProfile({
  currentUserId,
  currentUserRole,
  isTeacher,
  isStudent,
  visitedUser,
}: {
  readonly currentUserId: string;
  readonly currentUserRole: string;
  readonly isTeacher: boolean;
  readonly isStudent: boolean;
  readonly visitedUser: SuggestionList;
}) {
  const isVisitedUserTeacher = visitedUser.role === "teacher";
  const isVisitedUserStudent = visitedUser.role === "student";

  if (isVisitedUserTeacher) {
    return (
      <div className="p-6">
        <h2 className="text-2xl lg:text-3xl font-semibold ">
          Vidéos du professeur {visitedUser.first_name}
        </h2>
        <VideoListVisitor user={visitedUser} />
      </div>
    );
  }

  // CASE 3: If student visits another student, show suggestions
  if (isStudent && isVisitedUserStudent) {
    return (
      <div className="p-6">
        <SuggestionProfileStudentList user={visitedUser} />
      </div>
    );
  }

  // CASE 4: Optional - if teacher visits a student
  return (
    <div className="p-6 text-gray-500">
      Ce profil ne contient pas de contenu disponible à afficher.
    </div>
  );
}
