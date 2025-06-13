"use client";

import { Button } from "@/components/ui/button"; // Add this import
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { formatDistanceToNow } from "date-fns";
import { Clock, Eye, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Teacher = {
  id: string;
  first_name: string;
  last_name?: string;
  profile_url: string | null;
};

interface ExplorerVideoProps {
  video: RelatedVideo;
  user?: Teacher;
}

export default function ExplorerVideo({ video, user }: ExplorerVideoProps) {
  if (!video || !user) return null;

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Link href={`/videos/${video.id}`} className="group block w-full h-full">
      <article className="bg-white dark:bg-background rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out group-hover:-translate-y-0.5 border border-border/30 dark:border-border/70 h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <Image
            src={video.thumbnail_url ?? "/images/placeholder-thumbnail.png"}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-104"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/15" />

          <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="outline"
              className="hover:cursor-pointer rounded-full h-14 w-14 bg-background/90 backdrop-blur-sm border-1 hover:bg-border hover:text-primary-foreground transition-all duration-200"
            >
              <Play className="h-6 w-6 ml-0.5" />
            </Button>
          </div>

          {/* Subject badge with enhanced contrast */}
          <div className=" absolute top-3 left-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-950 text-white backdrop-blur-md border border-white/20 shadow-lg">
              {video.subject}
            </span>
          </div>

          {/* Class badge with enhanced contrast*/}
          <div className="hidden lg:block  absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center px-1.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md border border-black/10 shadow-lg">
              {video.class == "4ème année secondaire (bac)"
                ? video.class
                    ?.split(" ")
                    .slice(0, -1)
                    .join(" ")
                    .replace("année", "an.")
                : video.class?.replace("année", "an.")}
            </span>
          </div>

          {/* Duration overlay with better visibility */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/90 text-white backdrop-blur-md shadow-lg">
              <Clock className="w-3 h-3" />
              Watch
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-200 mb-4">
            {video.title}
          </h3>

          {/* Teacher info - removed online indicator */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={user.profile_url || "/images/placeholder-profile.png"}
              alt={`${user.first_name} ${user.last_name}`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Professeur(e)
              </p>
            </div>
          </div>

          {/* Branch tags */}
          {video.branch && video.branch.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {video.branch.slice(0, 2).map((branch, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border border-teal-200/50 dark:border-teal-700/50"
                >
                  {branch}
                </span>
              ))}
              {video.branch.length > 2 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border border-teal-200/50 dark:border-teal-700/50">
                  +{video.branch.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats - simplified without status */}
          <div className="mt-auto">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {formatViews(video.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(video.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
