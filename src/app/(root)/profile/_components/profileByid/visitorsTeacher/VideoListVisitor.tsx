"use client";

import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { Button } from "@/components/common/buttons/Button";
import { specialtyToSubject } from "@/lib/constants/specialties";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { UserProps } from "@/types/UserProps";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import FilterBar from "../FilterBar";

const LIMIT = 6;

// Skeleton component for loading state
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 rounded-lg aspect-video mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  </div>
);

export default function VideoListVisitor({
  user,
}: {
  readonly user: UserProps;
}) {
  const [videos, setVideos] = useState<RelatedVideo[]>([]);
  const [allVideos, setAllVideos] = useState<RelatedVideo[]>([]); // Keep all videos for filter options
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();

  // Get filter values from URL
  const selectedClass = searchParams.get("class") ?? "";
  const selectedBranch = searchParams.get("branch") ?? "";
  const selectedSubject = searchParams.get("subject") ?? "";

  const loadVideos = useCallback(
    async (resetData = false) => {
      setLoading(true);

      const currentOffset = resetData ? 0 : offset;

      try {
        const { success, videos: newVideos } = await getTeacherVideos(
          user.id,
          LIMIT,
          currentOffset
        );

        if (!success || !newVideos || newVideos.length === 0) {
          setHasMore(false);
          if (resetData) {
            setVideos([]);
          }
          return;
        }

        if (resetData) {
          setVideos(newVideos);
          setAllVideos(newVideos); // Update allVideos for filter options
          setOffset(LIMIT);
        } else {
          setVideos((prev) => {
            const updated = [...prev, ...newVideos];
            setAllVideos(updated); // Keep allVideos in sync
            return updated;
          });
          setOffset((prev) => prev + LIMIT);
        }

        // If we got less than LIMIT videos, we've reached the end
        if (newVideos.length < LIMIT) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error loading videos:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [user.id, offset]
  );

  // Initial load
  useEffect(() => {
    loadVideos(true);
  }, [user.id]);

  // Reset when filters change
  useEffect(() => {
    if (!initialLoading) {
      setVideos([]);
      setOffset(0);
      setHasMore(true);
      loadVideos(true);
    }
  }, [selectedClass, selectedBranch, selectedSubject]);

  // Extract unique subjects from user specialties
  const subjects = useMemo(
    () => [
      ...new Set(user?.specialties?.map((s) => specialtyToSubject[s]) || []),
    ],
    [user?.specialties]
  );

  // Extract unique classes from ALL video data (not filtered videos)
  const classes = useMemo(
    () => [...new Set(allVideos.map((video) => video.class).filter(Boolean))],
    [allVideos]
  );

  // Extract unique branches from ALL video data (not filtered videos)
  const branches = useMemo(
    () => [...new Set(allVideos.map((video) => video.branch).filter(Boolean))],
    [allVideos]
  );

  // Filter videos based on URL parameters
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      return (
        (selectedBranch ? video.branch?.includes(selectedBranch) : true) &&
        (selectedClass ? video.class === selectedClass : true) &&
        (selectedSubject ? video.subject === selectedSubject : true)
      );
    });
  }, [videos, selectedBranch, selectedClass, selectedSubject]);

  // Show skeleton during initial loading
  if (initialLoading) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 6 }).map((_, index) => (
            <VideoSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no videos after loading
  if (!initialLoading && allVideos.length === 0 && !loading) {
    return (
      <div className="p-8 flex flex-col gap-6">
        <p className="text-center text-gray-500">Pas encore de vidéos.</p>
      </div>
    );
  }

  // Validate filter data types
  if (
    !Array.isArray(classes) ||
    !Array.isArray(branches) ||
    !classes.every((item) => typeof item === "string") ||
    !branches.every((item) => typeof item === "object")
  ) {
    console.error("Invalid filter data types", { classes, branches });

    return (
      <div className="p-8">
        <p className="text-center text-red-500">
          Erreur lors du chargement des filtres.
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 flex flex-col gap-6">
      <FilterBar
        subjects={subjects}
        classes={classes}
        branches={branches}
        userIsTeacher={user.role === "teacher"}
        setLoading={setLoading}
      />

      <div className="grid md:grid-cols-3 gap-6 w-full">
        {!initialLoading && loading && videos.length === 0 ? (
          // Show skeleton when filtering (videos is empty but we're loading)
          Array.from({ length: 6 }).map((_, index) => (
            <VideoSkeleton key={`filtering-${index}`} />
          ))
        ) : filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <ExplorerVideo
              key={`${video.id}-${index}-{Math.random()}`}
              video={video}
              user={user}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            <p>Aucune vidéo ne correspond aux filtres sélectionnés.</p>
          </div>
        )}
      </div>

      {/* Show skeleton for loading more */}
      {loading && !initialLoading && videos.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 w-full">
          {Array.from({ length: 3 }).map((_, index) => (
            <VideoSkeleton key={`loading-${index}`} />
          ))}
        </div>
      )}

      {/* Load more button */}
      {hasMore && filteredVideos.length > 0 && !loading && (
        <Button
          onClick={() => loadVideos(false)}
          disabled={loading}
          className="mt-6 self-center bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition disabled:opacity-50"
        >
          Charger plus
        </Button>
      )}
    </div>
  );
}
// "use client";

// import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
// import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
// import { Button } from "@/components/common/buttons/Button";
// import { specialtyToSubject } from "@/lib/constants/specialties";
// import { RelatedVideo } from "@/types/RelatedVideos.interface";
// import { UserProps } from "@/types/UserProps";
// import { useSearchParams } from "next/navigation";
// import { useCallback, useEffect, useMemo, useState } from "react";
// import FilterBar from "../FilterBar";

// const LIMIT = 6;

// // Skeleton component for loading state
// const VideoSkeleton = () => (
//   <div className="animate-pulse">
//     <div className="bg-gray-200 rounded-lg aspect-video mb-4"></div>
//     <div className="space-y-2">
//       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//     </div>
//   </div>
// );

// export default function VideoListVisitor({
//   user,
// }: {
//   readonly user: UserProps;
// }) {
//   const [videos, setVideos] = useState<RelatedVideo[]>([]);
//   const [offset, setOffset] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);

//   const searchParams = useSearchParams();

//   // Get filter values from URL
//   const selectedClass = searchParams.get("class") ?? "";
//   const selectedBranch = searchParams.get("branch") ?? "";
//   const selectedSubject = searchParams.get("subject") ?? "";

//   const loadVideos = useCallback(
//     async (resetData = false) => {
//       setLoading(true);

//       const currentOffset = resetData ? 0 : offset;

//       try {
//         const { success, videos: newVideos } = await getTeacherVideos(
//           user.id,
//           LIMIT,
//           currentOffset
//         );

//         if (!success || !newVideos || newVideos.length === 0) {
//           setHasMore(false);
//           if (resetData) {
//             setVideos([]);
//           }
//           return;
//         }

//         if (resetData) {
//           setVideos(newVideos);
//           setOffset(LIMIT);
//         } else {
//           setVideos((prev) => [...prev, ...newVideos]);
//           setOffset((prev) => prev + LIMIT);
//         }

//         // If we got less than LIMIT videos, we've reached the end
//         if (newVideos.length < LIMIT) {
//           setHasMore(false);
//         }
//       } catch (error) {
//         console.error("Error loading videos:", error);
//         setHasMore(false);
//       } finally {
//         setLoading(false);
//         setInitialLoading(false);
//       }
//     },
//     [user.id, offset]
//   );

//   // Initial load
//   useEffect(() => {
//     loadVideos(true);
//   }, [user.id]);

//   // Reset when filters change
//   useEffect(() => {
//     if (!initialLoading) {
//       setVideos([]);
//       setOffset(0);
//       setHasMore(true);
//       loadVideos(true);
//     }
//   }, [selectedClass, selectedBranch, selectedSubject]);

//   // Extract unique subjects from user specialties
//   const subjects = useMemo(
//     () => [
//       ...new Set(user?.specialties?.map((s) => specialtyToSubject[s]) || []),
//     ],
//     [user?.specialties]
//   );

//   // Extract unique classes from video data
//   const classes = useMemo(
//     () => [...new Set(videos.map((video) => video.class).filter(Boolean))],
//     [videos]
//   );

//   // Extract unique branches from video data
//   const branches = useMemo(
//     () => [...new Set(videos.map((video) => video.branch).filter(Boolean))],
//     [videos]
//   );

//   // Filter videos based on URL parameters
//   const filteredVideos = useMemo(() => {
//     return videos.filter((video) => {
//       return (
//         (selectedBranch ? video.branch?.includes(selectedBranch) : true) &&
//         (selectedClass ? video.class === selectedClass : true) &&
//         (selectedSubject ? video.subject === selectedSubject : true)
//       );
//     });
//   }, [videos, selectedBranch, selectedClass, selectedSubject]);

//   // Show skeleton during initial loading
//   if (initialLoading) {
//     return (
//       <div className="p-8 flex flex-col gap-6">
//         <div className="grid md:grid-cols-3 gap-6 w-full">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <VideoSkeleton key={index} />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // Show empty state if no videos after loading
//   if (!initialLoading && videos.length === 0 && !loading) {
//     return (
//       <div className="p-8 flex flex-col gap-6">
//         <p className="text-center text-gray-500">Pas encore de vidéos.</p>
//       </div>
//     );
//   }

//   if (!initialLoading && loading) {
//     return (
//       <div className="grid md:grid-cols-3 gap-6 w-full p-6">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <VideoSkeleton key={`loading-${index + 20}`} />
//         ))}
//       </div>
//     );
//   }

//   // Validate filter data types
//   if (
//     !Array.isArray(classes) ||
//     !Array.isArray(branches) ||
//     !classes.every((item) => typeof item === "string") ||
//     !branches.every((item) => typeof item === "object")
//   ) {
//     console.error("Invalid filter data types", { classes, branches });

//     return (
//       <div className="p-8">
//         <p className="text-center text-red-500">
//           Erreur lors du chargement des filtres.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-8 flex flex-col gap-6">
//       <FilterBar
//         subjects={subjects}
//         classes={classes}
//         branches={branches}
//         userIsTeacher={user.role === "teacher"}
//         setLoading={setLoading}
//       />

//       <div className="grid md:grid-cols-3 gap-6 w-full">
//         {filteredVideos.length > 0 ? (
//           filteredVideos.map((video, index) => (
//             <ExplorerVideo
//               key={`${video.id}-${index}-{Math.random()}`}
//               video={video}
//               user={user}
//             />
//           ))
//         ) : (
//           <div className="col-span-full text-center text-gray-500">
//             <p>Aucune vidéo ne correspond aux filtres sélectionnés.</p>
//           </div>
//         )}
//       </div>

//       {/* Show skeleton for loading more */}
//       {loading && !initialLoading && (
//         <div className="grid md:grid-cols-3 gap-6 w-full">
//           {Array.from({ length: 3 }).map((_, index) => (
//             <VideoSkeleton key={`loading-${index}`} />
//           ))}
//         </div>
//       )}

//       {/* Load more button */}
//       {hasMore && filteredVideos.length > 0 && !loading && (
//         <Button
//           onClick={() => loadVideos(false)}
//           disabled={loading}
//           className="mt-6 self-center bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition disabled:opacity-50"
//         >
//           Charger plus
//         </Button>
//       )}
//     </div>
//   );
// }
