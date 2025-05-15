"use client";

import { getRelatedVideos } from "@/actions/videos/getRelatedVideos";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RelatedVideo {
  id: string;
  title: string;
  thumbnail_url: string | null;
  created_at: string;
  views: number;
  teacher: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export default function RelatedVideos({
  currentVideoId,
  subject,
  classValue,
}: {
  readonly currentVideoId: string;
  readonly subject: string;
  readonly classValue: string;
}) {
  const [videos, setVideos] = useState<RelatedVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      setIsLoading(true);
      const { data: relatedVideos } = await getRelatedVideos(
        currentVideoId,
        subject,
        classValue
      );
      setVideos(relatedVideos);
      setIsLoading(false);
    };

    fetchRelatedVideos();
  }, [currentVideoId, subject, classValue]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Explorer</h2>
        {[...Array(4)].map((i) => (
          <div key={i * 2} className="animate-pulse">
            <div className="flex gap-2">
              <div className="bg-gray-200 rounded-lg w-32 h-20"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Explorer</h2>

      <div className="space-y-4">
        {videos.map((video) => (
          <Link
            href={`/videos/${video.id}`}
            key={video.id}
            className="flex gap-3 group"
          >
            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={
                  video.thumbnail_url || "/placeholder.svg?height=80&width=128"
                }
                alt={video.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>

              <p className="text-xs text-gray-500 mt-1">{video.teacher.name}</p>

              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
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
        ))}

        {videos.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No related videos found
          </p>
        )}
      </div>
    </div>
  );
}
