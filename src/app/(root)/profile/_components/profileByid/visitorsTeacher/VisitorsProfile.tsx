import SuggestionProfileStudentList from "@/app/(root)/profile/_components/stduentSugguestion/SugguestionProfileStudentList";
import { roles } from "@/types/roles.enum";
import { SuggestionList } from "@/types/UserProps";
import VideoListVisitor from "./VideoListVisitor";

export default async function VisitorsProfile({
  currentUserId,
  currentUserRole,
  isDoctor,
  isPatient,
  visitedUser,
}: {
  readonly currentUserId: string;
  readonly currentUserRole: string;
  readonly isDoctor: boolean;
  readonly isPatient: boolean;
  readonly visitedUser: SuggestionList;
}) {
  const isVisitedUserDoctor = visitedUser.role === roles.doctor;
  const isVisitedUserPatient = visitedUser.role === roles.patient;
  // CASE 1 , 2: If teacher , student : visits another teacher
  if (isVisitedUserDoctor) {
    return (
      <div className="px-6 ">
        <h2 className="text-xl lg:text-2xl font-semibold ">
          Vidéos du professeur
        </h2>
        <VideoListVisitor user={visitedUser} />
      </div>
    );
  }

  // CASE 3: If student visits another student, show suggestions
  if (isPatient && isVisitedUserPatient) {
    return (
      <div className="p-6">
        <SuggestionProfileStudentList user={visitedUser} />
      </div>
    );
  }
  if (currentUserRole == roles.admin) {
    return (
      <div className="p-6">
        <SuggestionProfileStudentList user={visitedUser} />
      </div>
    );
  }

  // CASE 4: Optional - if teacher visits a student
  return (
    <div className="p-6 text-gray-500 dark:text-gray-400 text-sm">
      Ce profil appartient à un élève. Aucun contenu n&apos;est disponible à
      afficher pour le moment.
    </div>
  );
}
