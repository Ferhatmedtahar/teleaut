"use client";

import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { Button } from "@/components/common/buttons/Button";
import { specialtyToSubject } from "@/lib/constants/specialties";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { UserProps } from "@/types/UserProps";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "../FilterBar";

const LIMIT = 6;

export default function VideoListVisitor({
  user,
}: {
  readonly user: UserProps;
}) {
  const [videos, setVideos] = useState<RelatedVideo[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();

  // Get filter values from URL
  const selectedClass = searchParams.get("class") ?? "";
  const selectedBranch = searchParams.get("branch") ?? "";
  const selectedSubject = searchParams.get("subject") ?? "";

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

  // Extract unique subjects from video data
  const subjects = useMemo(
    () => [...new Set(user?.specialties.map((s) => specialtyToSubject[s]))],
    [user?.specialties]
  );

  // Extract unique classes from video data
  const classes = useMemo(
    () => [...new Set(videos.map((video) => video.class).filter(Boolean))],
    [videos]
  );

  // Extract unique branches from video data
  const branches = useMemo(
    () => [...new Set(videos.map((video) => video.branch).filter(Boolean))],
    [videos]
  );

  // Filter videos based on URL parameters
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      return (
        (selectedBranch ? video.branch.includes(selectedBranch) : true) &&
        (selectedClass ? video.class === selectedClass : true) &&
        (selectedSubject ? video.subject === selectedSubject : true)
      );
    });
  }, [videos, selectedBranch, selectedClass, selectedSubject]);

  if (videos.length === 0) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <p className="text-center">Pas encore de vidéos.</p>
      </div>
    );
  }
  if (
    !Array.isArray(classes) ||
    !Array.isArray(branches) ||
    !classes.every((item) => typeof item === "string") ||
    !branches.every((item) => typeof item === "string")
  ) {
    return null;
  }
  return (
    <div className="p-8 flex flex-col gap-6">
      <FilterBar
        subjects={subjects}
        classes={classes}
        branches={branches}
        userIsTeacher={user.role === "teacher"}
      />

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <ExplorerVideo key={video.id + index} video={video} user={user} />
          ))
        ) : (
          <p>Pas encore de vidéos.</p>
        )}
      </div>

      {hasMore && filteredVideos.length > 0 && (
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
