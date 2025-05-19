"use client";

import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { UserProps } from "@/types/UserProps";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function ExplorerVideo({
  video,
  user,
}: {
  readonly video: RelatedVideo;
  readonly user: UserProps;
}) {
  return (
    <Link
      href={`/videos/${video.id}`}
      key={video.id}
      className="group flex flex-col   border border-border/20 dark:border-border/90 rounded-xl overflow-hidden"
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <Image
          src={video.thumbnail_url ?? "/placeholder.svg?height=160&width=284"}
          alt={video.title}
          fill
          className="object-cover group-hover:scale-103 transition-transform"
        />
      </div>

      <div className="mt-2 px-2 pb-2">
        <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">
          {video.title}
        </h3>
        <div className="flex  items-center gap-2">
          <Image
            src={user.profile_url}
            alt={user.first_name}
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {user?.first_name} {user?.last_name}
          </p>
        </div>

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
