import { Skeleton } from "@/components/ui/skeleton";
import { SuggestionList } from "@/types/UserProps";
import { Suspense } from "react";
import TeachersListSugguestion from "./TeacherListSugguestion";
// import VideosListSugguestion from "./VideoListSugguestion";
export default function SuggestionProfileStudentList({
  user,
}: {
  readonly user: SuggestionList;
}) {
  return (
    <div className="space-y-10 p-6">
      {/* Recommended Teachers Section */}
      <div>
        <h2 className="text-xl font-semibold mb-6">Professeurs recommandés</h2>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <TeacherCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <TeachersListSugguestion
            userId={user.id}
            userClass={user.class}
            userBranch={user.branch}
          />
        </Suspense>
      </div>

      {/* Videos Section */}
      {/* <div>
        <h2 className="text-xl font-semibold mb-6">Vidéos recommandées</h2>
        <Suspense
          fallback={
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-medium mb-4">
                  Vidéos recommandées
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <VideoCardSkeleton key={i} />
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-lg font-medium mb-4">Vidéos populaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <VideoCardSkeleton key={i} />
                  ))}
                </div>
              </section>
            </div>
          }
        >
          <VideosListSugguestion
            userId={user.id}
            userClass={user.class}
            userBranch={user.branch}
          />
        </Suspense>
      </div> */}
    </div>
  );
}

// Loading skeleton for videos
function VideoCardSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="h-40 w-full rounded-lg mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

// Loading skeleton for teachers
function TeacherCardSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
