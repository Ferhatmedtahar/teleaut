"use client";

import { getRelatedVideos } from "@/actions/videos/getRelatedVideos";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { useEffect, useState } from "react";
import ExplorerVideo from "./ExplorerVideo";

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
      <div className="space-y-4 w-full">
        <h2 className="text-2xl font-semibold ">Explorer</h2>
        {[...Array(4)].map((i) => (
          <div key={i + 1} className="animate-pulse">
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
    <div className="space-y-6 w-full ">
      <h2 className="text-xl md:text-2xl  font-semibold ">Explorer</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <ExplorerVideo key={video.id} video={video} />
        ))}
      </div>

      {videos.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          No related videos found
        </p>
      )}
    </div>
  );
}
