import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { Eye, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function getTeacherName(teacher: any): string {
  if (!teacher) return "Professeur";
  return (
    `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim() ||
    "Professeur"
  );
}

export default function FeaturedVideo({
  featuredVideo,
}: {
  readonly featuredVideo: RelatedVideo;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-lg hover:shadow-border/10 border border-border/30 dark:border-border/90 transition-shadow duration-300">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-5 gap-0">
          <div className="md:col-span-2 relative aspect-video bg-gray-100 dark:bg-gray-800">
            <Link href={`/videos/${featuredVideo.id}`}>
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Button
                  size="icon"
                  variant="outline"
                  className="hover:cursor-pointer rounded-full h-14 w-14 bg-background/90 backdrop-blur-sm border-1 hover:bg-border hover:text-primary-foreground transition-all duration-200"
                >
                  <Play className="h-6 w-6 ml-0.5" />
                </Button>
              </div>
              <Image
                src={
                  featuredVideo.thumbnail_url ??
                  "/images/placeholder-thumbnail.png"
                }
                height={400}
                width={600}
                alt="Featured video"
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Content Section - Takes 3/5 of the width */}
          <div className="md:col-span-3 p-4 md:p-6 flex flex-col justify-between min-h-[240px]">
            {/* Header Section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2 mb-2">
                  {featuredVideo.title}
                </h3>
                <p className="text-primary-900 dark:text-primary-50 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {featuredVideo.description}
                </p>
              </div>

              {/* Tags Section - More compact layout */}
              <div className="space-y-2">
                {/* Class and Subject */}
                <div className="flex flex-wrap gap-1.5 md:gap-2">
                  {featuredVideo.class && (
                    <span className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium">
                      {featuredVideo.class}
                    </span>
                  )}
                  <span className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium">
                    {featuredVideo.subject}
                  </span>
                </div>

                {/* Branches on new line */}
                {featuredVideo.branch && featuredVideo.branch.length > 0 && (
                  <div className="flex flex-wrap gap-1 md:gap-1.5">
                    {featuredVideo.branch
                      .slice(0, 2)
                      .map((branchItem, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium"
                        >
                          {branchItem}
                        </span>
                      ))}
                    {featuredVideo.branch.length > 2 && (
                      <span className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium">
                        +{featuredVideo.branch.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Section */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              {/* Teacher Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
                  <AvatarImage
                    src={
                      featuredVideo.teacher?.profile_url ??
                      "/images/placeholder-profile.png"
                    }
                    alt={getTeacherName(featuredVideo.teacher)}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getTeacherName(featuredVideo.teacher)
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {getTeacherName(featuredVideo.teacher)}
                  </p>
                  <p className="text-xs text-primary-900 dark:text-primary-50">
                    @
                    {getTeacherName(featuredVideo.teacher)
                      .toLowerCase()
                      .replace(/\s+/g, "")}
                  </p>
                </div>
              </div>

              {featuredVideo.views && (
                <div className="flex items-center gap-1.5 text-primary-900 dark:text-primary-50">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {featuredVideo.views.toLocaleString()} vues
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
