import {
  getBranchAndClass,
  getHomePageVideos,
} from "@/actions/home/homeVideos.action";
import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { educationMapping } from "@/lib/constants/EducationsMapping";
import FeaturedVideo from "./FeaturedVideo";

function getTeacherName(teacher: any): string {
  if (!teacher) return "Professeur";
  return (
    `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim() ||
    "Professeur"
  );
}

function getSubjectsForClassAndBranch(
  className?: string,
  branch?: string
): string[] {
  if (!className) return [];

  const classData = educationMapping[className];
  if (!classData) return [];

  // If branch is provided and exists in the class data, use it
  if (branch && classData[branch]) {
    return classData[branch];
  }

  // Otherwise use default subjects for the class
  if (classData._default) {
    return classData._default;
  }

  // If no default, return first available branch subjects
  const firstBranch = Object.keys(classData).find((key) => key !== "_default");
  return firstBranch ? classData[firstBranch] : [];
}

export default async function HomePage() {
  const { success, featuredVideo, explorerVideos } = await getHomePageVideos();
  const { success: branchAndClassSuccess, branchAndClass } =
    await getBranchAndClass();

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="dark:text-primary-50/80   ">
            Impossible de charger les vidéos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }

  // Get subjects based on user's class and branch (if available)
  const userSubjects =
    branchAndClassSuccess && branchAndClass
      ? getSubjectsForClassAndBranch(
          branchAndClass.class || undefined,
          branchAndClass.branch || undefined
        )
      : [];

  // Create subjects array with "Tous" (All) as first option
  const subjects = ["Tous", ...userSubjects];

  // Filter videos by subject
  const filterVideosBySubject = (videos: any[], subject: string) => {
    if (subject === "tous") return videos;
    return videos.filter((video) => video.subject === subject);
  };

  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg ">
      {subjects.length > 1 && (
        <Tabs defaultValue="tous" className="w-full">
          <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-border/30 dark:border-border/70 h-auto p-1">
            {subjects.map((subject) => (
              <TabsTrigger
                key={subject}
                value={subject.toLowerCase().replace(/\s+/g, "-")}
                className="px-3 py-2 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
              >
                {subject}
              </TabsTrigger>
            ))}
          </TabsList>

          {subjects.map((subject) => (
            <TabsContent
              key={subject}
              value={subject.toLowerCase().replace(/\s+/g, "-")}
              className="mt-6 space-y-6"
            >
              {featuredVideo &&
                filterVideosBySubject([featuredVideo], subject.toLowerCase())
                  .length > 0 && (
                  <section>
                    <h2 className="text-2xl font-bold mb-4">Featured</h2>
                    <FeaturedVideo featuredVideo={featuredVideo} />
                  </section>
                )}

              {/* Explorer Section */}
              {(() => {
                const filteredVideos = filterVideosBySubject(
                  explorerVideos,
                  subject.toLowerCase()
                );

                return (
                  filteredVideos.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Explorer</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVideos.map((video) => (
                          <ExplorerVideo
                            key={video.id}
                            video={video}
                            user={video.teacher}
                          />
                        ))}
                      </div>
                    </section>
                  )
                );
              })()}

              {filterVideosBySubject(
                [...(featuredVideo ? [featuredVideo] : []), ...explorerVideos],
                subject
              ).length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">
                    Aucune vidéo trouvée
                  </h3>
                  <p className="text-primary-800 dark:text-primary-200">
                    Aucune vidéo disponible pour la matière &quot;{subject}
                    &quot;.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Fallback when no subjects are available */}
      {subjects.length <= 1 && (
        <>
          {/* Featured Section */}
          {featuredVideo && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Featured</h2>
              <FeaturedVideo featuredVideo={featuredVideo} />
            </section>
          )}

          {/* Explorer Section */}
          {explorerVideos.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Explorer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {explorerVideos.map((video) => (
                  <ExplorerVideo
                    key={video.id}
                    video={video}
                    user={video.teacher}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
