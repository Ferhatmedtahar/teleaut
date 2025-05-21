"use client";

import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
import { Button } from "@/components/common/buttons/Button";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { UserProps } from "@/types/UserProps";
import { useEffect, useState } from "react";
import ExplorerVideo from "../../(videos)/_components/videos/ExplorerVideo";

const LIMIT = 6;

export default function TeacherVideosList({
  user,
}: {
  readonly user: UserProps;
}) {
  const [videos, setVideos] = useState<RelatedVideo[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadVideos = async () => {
    setLoading(true);
    const { success, videos: newVideos } = await getTeacherVideos(
      user.id,
      LIMIT,
      offset
    );
    setLoading(false);

    if (!success || !newVideos || newVideos.length === 0) {
      setHasMore(false);
      return;
    }

    setVideos((prev) => [...prev, ...newVideos]);
    setOffset((prev) => prev + LIMIT);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  return (
    <div className="p-8 flex flex-col gap-4">
      <h2 className="text-2xl lg:text-3xl font-semibold">Your Videos</h2>

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {videos.length > 0 ? (
          videos.map((video: RelatedVideo, index: number) => (
            <ExplorerVideo key={video.id + index} video={video} user={user} />
          ))
        ) : (
          <p>Teacher has no videos yet!</p>
        )}
      </div>

      {hasMore && (
        <Button
          onClick={loadVideos}
          disabled={loading}
          className="mt-6 self-center bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition"
        >
          {loading && <span className="animate-spin mr-2">⌛</span>}
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  );
}
