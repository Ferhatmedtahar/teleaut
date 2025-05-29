"use client";

import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { RelatedVideoUser } from "@/types/UserProps";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default function ExplorerVideo({
  video,
  user,
}: {
  readonly video: RelatedVideo;
  readonly user?: RelatedVideoUser;
}) {
  // console.log("ExplorerVideo", video, user);
  if (!video || !user) return null;
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
        <div className="flex justify-between pb-2">
          <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">
            {video.title}
          </h3>
          {video.branch && video.branch.length > 0 && (
            <p className="px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
              {video.branch[0]}
              {video.branch.length > 1 && `... +${video.branch.length - 1}`}
            </p>
          )}
        </div>
        <div className="flex  items-center gap-2">
          <Image
            src={user.profile_url ?? "/images/placeholder-profile.png"}
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
