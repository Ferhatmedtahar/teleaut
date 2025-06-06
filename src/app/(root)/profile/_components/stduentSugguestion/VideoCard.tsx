"use client";

import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface VideoProps {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url: string;
  duration?: number;
  views?: number;
  likes?: number;
  created_at?: string;
  updated_at?: string;
  teacher_id: string;
  class: string;
  branch?: string;
  subject: string;
}
export interface TeacherInfo {
  id: string;
  first_name: string;
  last_name?: string;
  profile_url?: string;
  rating?: number;
}

export interface VideoWithTeacher extends VideoProps {
  teacher?: TeacherInfo;
}

interface VideoCardProps {
  readonly video: VideoWithTeacher;
}

export default function VideoCard({ video }: VideoCardProps) {
  const formattedDate = video.created_at
    ? formatDistanceToNow(new Date(video.created_at), {
        addSuffix: true,
        locale: fr,
      })
    : "";

  return (
    <Link href={`/videos/${video.id}`}>
      <div className="group rounded-lg overflow-hidden border border-border/5 dark:border-border/10 hover:shadow-sm hover:shadow-border/15 transition-all duration-300">
        <div className="relative w-full aspect-video overflow-hidden">
          {video.thumbnail_url ? (
            <>
              <Image
                src={video.thumbnail_url}
                alt={video.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <PlayCircle className="w-14 h-14 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-muted">
              <span className="text-muted-foreground text-sm">
                Aucun thumbnail
              </span>
            </div>
          )}
        </div>

        <div className="p-3">
          <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center mt-2 mb-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden mr-2">
              <Image
                src={video.teacher?.profile_url || "/placeholder-avatar.jpg"}
                alt={video.teacher?.first_name || "Professor"}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {video.teacher?.first_name} {video.teacher?.last_name}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {video.subject}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {video.class}
            </Badge>
            {video.branch && video.branch !== "Tous" && (
              <Badge variant="outline" className="text-xs">
                {video.branch}
              </Badge>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
            <span>{video.views || 0} vues</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
