import { getHomePageVideos } from "@/actions/home/homeVideos.action";
import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function getTeacherName(teacher: any): string {
  if (!teacher) return "Professeur";
  return (
    `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
    "Professeur"
  );
}
export default async function HomePage() {
  // const subjects = ["All", "Math", "Science", "Physique", "Arab", "Eng", "ITA"];

  const { success, featuredVideo, explorerVideos } = await getHomePageVideos();

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
          <p className="text-muted-foreground">
            Impossible de charger les vidéos. Veuillez réessayer plus tard.
          </p>
        </div>
      </div>
    );
  }
  // console.log("Featured Video:", featuredVideo);
  return (
    <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg">
      <Tabs defaultValue="all" className="w-full">
        {/*
        <TabsList className="flex flex-wrap gap-2 dark:bg-background/80 bg-background/80 border border-white/90">
          {subjects.map((subject) => (
            <TabsTrigger
              key={subject}
              value={subject.toLowerCase()}
              className="px-4 py-1 cursor-pointer"
            >
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>
         */}
      </Tabs>

      {/* Featured Section */}
      {featuredVideo && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured</h2>
          <Card>
            <CardContent className="p-0">
              <div className="grid md:grid-cols-2 gap-4 p-6">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <Link href={`/videos/${featuredVideo.id}`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        size="icon"
                        variant="outline"
                        className="hover:cursor-pointer rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                    <Image
                      src={
                        featuredVideo.thumbnail_url ??
                        "/images/placeholder-thumbnail.png"
                      }
                      height={300}
                      width={500}
                      alt="Featured video"
                      className="object-cover w-full h-full"
                    />
                  </Link>
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{featuredVideo.title}</h3>
                    <p className="text-muted-foreground mt-2">
                      {featuredVideo.description}
                    </p>
                    <div className="flex gap-2">
                      <div className="text-xs mt-2  ">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <p>
                              {featuredVideo.class && (
                                <span
                                  //  className=" font-medium"
                                  className="px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs"
                                >
                                  {featuredVideo.class}
                                </span>
                              )}
                            </p>
                            <p
                              //  className="ml-2 py-1"
                              className="px-2 py-1 w-fit bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs"
                            >
                              {featuredVideo.subject}
                            </p>
                          </div>

                          {/* featuredVideo.branch?.length > 0 && */}
                          {featuredVideo.branch &&
                            featuredVideo.branch?.length > 0 && (
                              <span className=" font-medium">
                                {featuredVideo.branch.length > 0 && (
                                  <p className="w-fit  px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
                                    {featuredVideo.branch[0]}
                                    {featuredVideo.branch.length > 1 &&
                                      `... +${featuredVideo.branch.length - 1}`}
                                  </p>
                                )}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          featuredVideo.teacher?.profile_url ??
                          "/images/placeholder-profile.png"
                        }
                        alt={getTeacherName(featuredVideo.teacher)}
                      />
                      <AvatarFallback>
                        {getTeacherName(featuredVideo.teacher).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {getTeacherName(featuredVideo.teacher)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @
                        {getTeacherName(featuredVideo.teacher)
                          .toLowerCase()
                          .replace(" ", "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Explorer Section */}
      {explorerVideos.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Explorer</h2>
          <div className="grid md:grid-cols-3 gap-6">
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
    </div>
  );
}
