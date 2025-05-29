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
                        className="rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
                      >
                        <Play className="h-8 w-8" />
                      </Button>
                    </div>
                    <Image
                      src={featuredVideo.thumbnail_url || "/placeholder.svg"}
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
                    <div>
                      <div className="text-xs mt-2">
                        <div>
                          {featuredVideo.branch?.length > 0 && (
                            <>
                              <p>branch</p>
                              <span className="ml-2 font-medium">
                                {featuredVideo.branch.join(", ")}
                              </span>
                            </>
                          )}
                        </div>
                        <p>
                          {featuredVideo.class && (
                            <span className="ml-2 font-medium">
                              {featuredVideo.class}
                            </span>
                          )}
                        </p>
                        <p>{featuredVideo.subject}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={
                          featuredVideo.teacher?.profile_url ||
                          "/placeholder.svg" ||
                          "/placeholder.svg"
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
