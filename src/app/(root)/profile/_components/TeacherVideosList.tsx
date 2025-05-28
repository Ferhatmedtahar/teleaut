"use client";

import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
import { Button } from "@/components/common/buttons/Button";
import { specialtyToSubject } from "@/lib/constants/specialties";
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { UserProps } from "@/types/UserProps";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ExplorerVideo from "../../(videos)/_components/videos/ExplorerVideo";
import FilterBar from "./profileByid/FilterBar";

const LIMIT = 6;

export default function TeacherVideosList({
  user,
}: {
  readonly user: UserProps;
}) {
  const [videos, setVideos] = useState<RelatedVideo[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
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
    setInitialLoading(false);

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

  const subjects = useMemo(
    () => [
      ...new Set(user?.specialties?.map((s) => specialtyToSubject[s]) || []),
    ],
    [user?.specialties]
  );

  const classes = useMemo(
    () => [...new Set(videos.map((video) => video.class).filter(Boolean))],
    [videos]
  );

  const branches =
    studentClassesAndBranches[
      selectedClass as keyof typeof studentClassesAndBranches
    ] || [];

  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      return (
        (selectedBranch ? video.branch?.includes(selectedBranch) : true) &&
        (selectedClass ? video.class === selectedClass : true) &&
        (selectedSubject ? video.subject === selectedSubject : true)
      );
    });
  }, [videos, selectedBranch, selectedClass, selectedSubject]);

  if (
    !Array.isArray(classes) ||
    !classes.every((item) => typeof item === "string") ||
    !branches.every((item) => typeof item === "string")
  ) {
    return (
      <div className="p-8 flex flex-col gap-4">
        <h2 className="text-2xl lg:text-3xl font-semibold">Your Videos</h2>
        <p>Loading videos...</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-4">
      <h2 className="text-2xl lg:text-3xl font-semibold">Your Videos</h2>

      {videos.length > 0 && (
        <FilterBar
          subjects={subjects}
          classes={classes}
          branches={branches}
          userIsTeacher={user.role === "teacher"}
        />
      )}

      {/* Loading skeleton */}
      {initialLoading ? (
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg overflow-hidden bg-gray-300"
            >
              <div className="bg-gray-200 h-40 w-full" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200/90 rounded w-3/4" />
                <div className="h-3 bg-gray-200/90 rounded w-1/2" />
                <div className="h-3 bg-gray-200/90 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <ExplorerVideo key={video.id + index} video={video} user={user} />
            ))
          ) : (
            <p>No videos match the selected filters.</p>
          )}
        </div>
      )}

      {!initialLoading && videos.length === 0 && (
        <p className="text-gray-500 text-center py-4">
          Teacher has no videos yet!
        </p>
      )}

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
