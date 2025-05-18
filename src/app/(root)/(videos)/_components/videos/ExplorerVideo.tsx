"use client";

import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function ExplorerVideo({
  video,
}: {
  readonly video: RelatedVideo;
}) {
  return (
    <Link
      href={`/videos/${video.id}`}
      key={video.id}
      className="group flex flex-col"
    >
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <Image
          src={video.thumbnail_url ?? "/placeholder.svg?height=160&width=284"}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-103 transition-transform"
        />
      </div>

      <div className="mt-2">
        <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">
          {video.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {video.teacher.first_name} {video.teacher.last_name}
        </p>

        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
          <span>{video.views} views</span>
          <span>•</span>
          <span>
            {formatDistanceToNow(new Date(video.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
