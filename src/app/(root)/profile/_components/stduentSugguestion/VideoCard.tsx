"use client";

import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Clock, PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
  video: VideoWithTeacher;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Format the duration (assuming duration is stored in seconds)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Format the creation date
  const formattedDate = video.created_at
    ? formatDistanceToNow(new Date(video.created_at), {
        addSuffix: true,
        locale: fr,
      })
    : "";

  return (
    <Link href={`/video/${video.id}`}>
      <div
        className="group rounded-lg overflow-hidden bg-card border shadow-sm hover:shadow-md transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail Section */}
        <div className="relative w-full aspect-video overflow-hidden">
          <Image
            src={video.thumbnail_url || "/placeholder-video.jpg"}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatDuration(video.duration)}
            </div>
          )}

          {/* Play button overlay on hover */}
          <div
            className={`absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : ""
            }`}
          >
            <PlayCircle className="w-14 h-14 text-white/90" />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3">
          <h3 className="font-medium line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>

          {/* Teacher info */}
          <div className="flex items-center mt-2 mb-3">
            <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
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

          {/* Tags */}
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

          {/* Stats */}
          <div className="flex justify-between items-center mt-3 text-xs text-muted-foreground">
            <span>{video.views || 0} vues</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
