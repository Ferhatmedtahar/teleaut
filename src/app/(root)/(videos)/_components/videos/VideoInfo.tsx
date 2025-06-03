"use client";

import {
  deleteVideoRating,
  getUserRating,
  getVideoRatingStats,
  setVideoRating,
} from "@/actions/videos/likes";
import { Button } from "@/components/common/buttons/Button";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { toast } from "sonner";
import RenderStars from "./RenderStars";
import ShareLink from "./ShareLink";

interface VideoInfoProps {
  readonly video: {
    readonly id: string;
    readonly title: string;
    readonly created_at: string;
    readonly views: number;
    readonly class: string;
    readonly branch: string[];
    readonly teacher: {
      id: string;
      first_name: string;
      last_name?: string;
      profile_url: string | null;
    };
  };
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalRatings: 0,
  });
  const [userRating, setUserRating] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchRatingData = async () => {
      const [{ data: statsData }, { data: userRatingData }] = await Promise.all(
        [getVideoRatingStats(video.id), getUserRating(video.id)]
      );

      setRatingStats(statsData);
      setUserRating(userRatingData);
      setSelectedRating(userRatingData);
      setShowDeleteButton(userRatingData !== null);
    };

    fetchRatingData();
  }, [video.id]);

  // Show submit button when selection differs from current rating
  useEffect(() => {
    if (selectedRating !== null && selectedRating !== userRating) {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  }, [selectedRating, userRating]);

  const handleRatingSelection = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleSubmitRating = async () => {
    if (selectedRating === null) return;

    setIsLoading(true);

    const result = await setVideoRating(video.id, selectedRating);
    console.log("Rating result:", result);
    if (!result.success) {
      toast.error("Failed to submit rating", {
        description: result.message,
      });
    } else {
      toast.success("Rating submitted successfully!");
      setUserRating(selectedRating);
      setRatingStats(result.data);
      setShowSubmitButton(false);
      setShowDeleteButton(true);
    }

    setIsLoading(false);
  };

  const handleDeleteRating = async () => {
    if (!userRating) return;

    setIsLoading(true);

    const result = await deleteVideoRating(video.id);
    console.log("Delete rating result:", result);

    if (!result.success) {
      toast.error("Failed to delete rating", {
        description: result.message,
      });
    } else {
      toast.success("Rating deleted successfully!");
      setUserRating(null);
      setSelectedRating(null);
      setRatingStats(result.data);
      setShowSubmitButton(false);
      setShowDeleteButton(false);
    }

    setIsLoading(false);
  };

  // function RenderStars() {
  //   const stars = [];
  //   const displayRating =
  //     hoveredRating !== null ? hoveredRating : selectedRating || 0;

  //   for (let i = 1; i <= 5; i++) {
  //     stars.push(
  //       <div key={i} className="relative">
  //         {/* Full star button */}
  //         <button
  //           className="relative focus:outline-none disabled:cursor-not-allowed transition-all duration-150"
  //           disabled={isLoading}
  //           onMouseEnter={() => setHoveredRating(i)}
  //           onMouseLeave={() => setHoveredRating(null)}
  //           onClick={() => handleRatingSelection(i)}
  //         >
  //           <Star
  //             size={20}
  //             className={`transition-colors duration-150 ${
  //               displayRating >= i
  //                 ? "fill-yellow-400 text-yellow-400"
  //                 : "fill-transparent text-gray-300 hover:text-yellow-400"
  //             }`}
  //           />
  //         </button>

  //         {/* Half star overlay button */}
  //         <button
  //           className="absolute left-0 top-0 w-[80%] h-full focus:outline-none disabled:cursor-not-allowed z-10"
  //           disabled={isLoading}
  //           onMouseEnter={() => setHoveredRating(i - 0.5)}
  //           onMouseLeave={() => setHoveredRating(null)}
  //           onClick={() => handleRatingSelection(i - 0.5)}
  //         >
  //           <div className="w-[60%] h-full overflow-hidden">
  //             <Star
  //               size={20}
  //               className={`transition-colors duration-150 ${
  //                 displayRating >= i - 0.6 && displayRating < i
  //                   ? "fill-yellow-400 text-yellow-400"
  //                   : "fill-transparent text-transparent"
  //               }`}
  //             />
  //           </div>
  //         </button>
  //       </div>
  //     );
  //   }

  //   return stars;
  // }

  return (
    <div className="space-y-4">
      {/* Title and Class Level */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
          {video.title}
        </h1>
        <div className="flex-shrink-0">
          <span className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium">
            Niveau : {video.class}
          </span>
        </div>
      </div>

      {/* Branches */}
      {video.branch && video.branch.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm rounded-full">
            Pour les élèves des branches suivantes :
          </p>
          <div className="flex flex-wrap gap-2">
            {video.branch.map((branch, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Views and Time */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Image
              src="/icons/views-dark.svg"
              alt="Views"
              width={16}
              height={16}
            />
          ) : (
            <Image src="/icons/views.svg" alt="Views" width={16} height={16} />
          )}
          <span className="text-primary-900 dark:text-primary-100">
            {video.views} views
          </span>
        </div>

        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <FaClockRotateLeft size={16} />
          ) : (
            <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
          )}
          <span className="text-primary-900 dark:text-primary-100">
            {formatDistanceToNow(new Date(video.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Teacher Info and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Teacher Info */}
        <Link
          href={`/profile/${video.teacher.id}`}
          target="_blank"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          {video.teacher.profile_url ? (
            <Image
              src={video.teacher.profile_url}
              alt={video.teacher.first_name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-primary-900 dark:text-primary-100 font-medium text-sm">
                {video.teacher.first_name.charAt(0)}
                {video.teacher.last_name?.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-sm">
              {video.teacher.first_name} {video.teacher.last_name}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {
                <RenderStars
                  handleRatingSelection={handleRatingSelection}
                  selectedRating={selectedRating}
                  isLoading={isLoading}
                  hoveredRating={hoveredRating}
                  key={video.id}
                  setHoveredRating={setHoveredRating}
                />
              }
            </div>
            <div className="flex flex-col items-start text-xs text-gray-600 dark:text-gray-400 ml-2">
              <span>{ratingStats.averageRating.toFixed(1)}</span>
              <span>({ratingStats.totalRatings})</span>
            </div>
          </div>

          <ShareLink isLoading={isLoading} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
        {/* Submit Button */}
        {showSubmitButton && (
          <Button
            onClick={handleSubmitRating}
            disabled={isLoading}
            className="px-5 py-2   text-white rounded-lg font-medium  disabled:cursor-not-allowed"
          >
            {isLoading ? "Soumission..." : "Soumettre un avis"}
            {/* {isLoading ? "Submitting..." : "Submit Rating"} */}
          </Button>
        )}

        {/* Delete Button */}
        {showDeleteButton && !showSubmitButton && (
          <Button
            onClick={handleDeleteRating}
            disabled={isLoading}
            variant={"destructive"}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 border border-red-900 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            {isLoading ? "Suppression..." : "Supprimer"}
            {/* {isLoading ? "Deleting..." : "Delete Rating"} */}
          </Button>
        )}
      </div>

      {/* Current Rating Display */}
      {selectedRating !== null && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {userRating !== null && selectedRating === userRating ? (
            <>
              Your rating: {selectedRating} star
              {selectedRating !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              Selected: {selectedRating} star{selectedRating !== 1 ? "s" : ""}
            </>
          )}
        </div>
      )}

      <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
    </div>
  );
}
// "use client";

// import {
//   getUserRating,
//   getVideoRatingStats,
//   setVideoRating,
// } from "@/actions/videos/likes";
// import { formatDistanceToNow } from "date-fns";
// import { Star } from "lucide-react";
// import { useTheme } from "next-themes";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { FaClockRotateLeft } from "react-icons/fa6";
// import { toast } from "sonner";
// import ShareLink from "./ShareLink";

// interface VideoInfoProps {
//   readonly video: {
//     readonly id: string;
//     readonly title: string;
//     readonly created_at: string;
//     readonly views: number;
//     readonly class: string;
//     readonly branch: string[];
//     readonly teacher: {
//       id: string;
//       first_name: string;
//       last_name?: string;
//       profile_url: string | null;
//     };
//   };
// }

// export default function VideoInfo({ video }: VideoInfoProps) {
//   const [ratingStats, setRatingStats] = useState({
//     averageRating: 0,
//     totalRatings: 0,
//   });
//   const [userRating, setUserRating] = useState<number | null>(null);
//   const [selectedRating, setSelectedRating] = useState<number | null>(null);
//   const [hoveredRating, setHoveredRating] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSubmitButton, setShowSubmitButton] = useState(false);
//   const { theme } = useTheme();

//   useEffect(() => {
//     const fetchRatingData = async () => {
//       const [{ data: statsData }, { data: userRatingData }] = await Promise.all(
//         [getVideoRatingStats(video.id), getUserRating(video.id)]
//       );

//       setRatingStats(statsData);
//       setUserRating(userRatingData);
//       setSelectedRating(userRatingData);
//     };

//     fetchRatingData();
//   }, [video.id]);

//   // Show submit button when selection differs from current rating
//   useEffect(() => {
//     if (selectedRating !== null && selectedRating !== userRating) {
//       setShowSubmitButton(true);
//     } else {
//       setShowSubmitButton(false);
//     }
//   }, [selectedRating, userRating]);

//   const handleRatingSelection = (rating: number) => {
//     setSelectedRating(rating);
//   };

//   const handleSubmitRating = async () => {
//     if (selectedRating === null) return;

//     setIsLoading(true);

//     const result = await setVideoRating(video.id, selectedRating);
//     console.log("Rating result:", result);
//     if (!result.success) {
//       toast.error("Failed to submit rating", {
//         description: result.message,
//       });
//     } else {
//       toast.success("Rating submitted successfully!");
//       setUserRating(selectedRating);
//       setRatingStats(result.data);
//       setShowSubmitButton(false);
//     }

//     setIsLoading(false);
//   };

//   const renderStars = () => {
//     const stars = [];
//     const displayRating =
//       hoveredRating !== null ? hoveredRating : selectedRating || 0;

//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <div key={i} className="relative">
//           {/* Full star button */}
//           <button
//             className="relative focus:outline-none disabled:cursor-not-allowed transition-all duration-150"
//             disabled={isLoading}
//             onMouseEnter={() => setHoveredRating(i)}
//             onMouseLeave={() => setHoveredRating(null)}
//             onClick={() => handleRatingSelection(i)}
//           >
//             <Star
//               size={20}
//               className={`transition-colors duration-150 ${
//                 displayRating >= i
//                   ? "fill-yellow-400 text-yellow-400"
//                   : "fill-transparent text-gray-300 hover:text-yellow-400"
//               }`}
//             />
//           </button>

//           {/* Half star overlay button */}
//           <button
//             className="absolute left-0 top-0 w-1/2 h-full focus:outline-none disabled:cursor-not-allowed z-10"
//             disabled={isLoading}
//             onMouseEnter={() => setHoveredRating(i - 0.5)}
//             onMouseLeave={() => setHoveredRating(null)}
//             onClick={() => handleRatingSelection(i - 0.5)}
//           >
//             <div className="w-1/2 h-full overflow-hidden">
//               <Star
//                 size={20}
//                 className={`transition-colors duration-150 ${
//                   displayRating >= i - 0.5 && displayRating < i
//                     ? "fill-yellow-400 text-yellow-400"
//                     : "fill-transparent text-transparent"
//                 }`}
//               />
//             </div>
//           </button>
//         </div>
//       );
//     }

//     return stars;
//   };

//   return (
//     <div className="space-y-4">
//       {/* Title and Class Level */}
//       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
//         <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
//           {video.title}
//         </h1>
//         <div className="flex-shrink-0">
//           <span className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium">
//             Niveau : {video.class}
//           </span>
//         </div>
//       </div>

//       {/* Branches */}
//       {video.branch && video.branch.length > 0 && (
//         <div className="space-y-2">
//           <p className="text-sm rounded-full">
//             Pour les élèves des branches suivantes :
//           </p>
//           <div className="flex flex-wrap gap-2">
//             {video.branch.map((branch, idx) => (
//               <span
//                 key={idx}
//                 className="inline-block px-2 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs"
//               >
//                 {branch}
//               </span>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Views and Time */}
//       <div className="flex flex-wrap items-center gap-4 text-sm">
//         <div className="flex items-center gap-2">
//           {theme === "dark" ? (
//             <Image
//               src="/icons/views-dark.svg"
//               alt="Views"
//               width={16}
//               height={16}
//             />
//           ) : (
//             <Image src="/icons/views.svg" alt="Views" width={16} height={16} />
//           )}
//           <span className="text-primary-900 dark:text-primary-100">
//             {video.views} views
//           </span>
//         </div>

//         <div className="flex items-center gap-2">
//           {theme === "dark" ? (
//             <FaClockRotateLeft size={16} />
//           ) : (
//             <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
//           )}
//           <span className="text-primary-900 dark:text-primary-100">
//             {formatDistanceToNow(new Date(video.created_at), {
//               addSuffix: true,
//             })}
//           </span>
//         </div>
//       </div>

//       {/* Teacher Info and Actions */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         {/* Teacher Info */}
//         <Link
//           href={`/profile/${video.teacher.id}`}
//           target="_blank"
//           className="flex items-center gap-3 hover:opacity-90 transition-opacity"
//         >
//           {video.teacher.profile_url ? (
//             <Image
//               src={video.teacher.profile_url}
//               alt={video.teacher.first_name}
//               width={40}
//               height={40}
//               className="w-10 h-10 rounded-full object-cover"
//             />
//           ) : (
//             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
//               <span className="text-primary-900 dark:text-primary-100 font-medium text-sm">
//                 {video.teacher.first_name.charAt(0)}
//                 {video.teacher.last_name?.charAt(0)}
//               </span>
//             </div>
//           )}
//           <div>
//             <p className="font-medium text-sm">
//               {video.teacher.first_name} {video.teacher.last_name}
//             </p>
//           </div>
//         </Link>

//         <div className="flex items-center gap-4">
//           {/* Star Rating */}
//           <div className="flex items-center gap-2">
//             <div className="flex items-center">{renderStars()}</div>
//             <div className="flex flex-col items-start text-xs text-gray-600 dark:text-gray-400 ml-2">
//               <span>{ratingStats.averageRating.toFixed(1)}</span>
//               <span>({ratingStats.totalRatings})</span>
//             </div>
//           </div>

//           <ShareLink isLoading={isLoading} />
//         </div>
//       </div>

//       {/* Submit Button */}
//       {showSubmitButton && (
//         <div className="flex justify-center mt-4">
//           <button
//             onClick={handleSubmitRating}
//             disabled={isLoading}
//             className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
//           >
//             {isLoading ? "Submitting..." : "Submit Rating"}
//           </button>
//         </div>
//       )}

//       {/* Current Rating Display */}
//       {selectedRating !== null && (
//         <div className="text-center text-sm text-gray-600 dark:text-gray-400">
//           Selected: {selectedRating} star{selectedRating !== 1 ? "s" : ""}
//         </div>
//       )}

//       <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
//     </div>
//   );
// }
// // "use client";

// // import {
// //   getUserRating,
// //   getVideoRatingStats,
// //   setVideoRating,
// // } from "@/actions/videos/likes";
// // import { formatDistanceToNow } from "date-fns";
// // import { Star } from "lucide-react";
// // import { useTheme } from "next-themes";
// // import Image from "next/image";
// // import Link from "next/link";
// // import { useEffect, useState } from "react";
// // import { FaClockRotateLeft } from "react-icons/fa6";
// // import { toast } from "sonner";
// // import ShareLink from "./ShareLink";

// // interface VideoInfoProps {
// //   readonly video: {
// //     readonly id: string;
// //     readonly title: string;
// //     readonly created_at: string;
// //     readonly views: number;
// //     readonly class: string;
// //     readonly branch: string[];
// //     readonly teacher: {
// //       id: string;
// //       first_name: string;
// //       last_name?: string;
// //       profile_url: string | null;
// //     };
// //   };
// // }

// // export default function VideoInfo({ video }: VideoInfoProps) {
// //   const [ratingStats, setRatingStats] = useState({
// //     averageRating: 0,
// //     totalRatings: 0,
// //   });
// //   const [userRating, setUserRating] = useState<number | null>(null);
// //   const [hoveredRating, setHoveredRating] = useState<number | null>(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const { theme } = useTheme();

// //   useEffect(() => {
// //     const fetchRatingData = async () => {
// //       const [{ data: statsData }, { data: userRatingData }] = await Promise.all(
// //         [getVideoRatingStats(video.id), getUserRating(video.id)]
// //       );

// //       setRatingStats(statsData);
// //       setUserRating(userRatingData);
// //     };

// //     fetchRatingData();
// //   }, [video.id]);

// //   const handleRating = async (rating: number) => {
// //     setIsLoading(true);

// //     const prevUserRating = userRating;
// //     const prevRatingStats = { ...ratingStats };

// //     // Optimistically update UI
// //     if (prevUserRating === null) {
// //       // New rating
// //       setUserRating(rating);
// //       setRatingStats((prev) => ({
// //         averageRating:
// //           (prev.averageRating * prev.totalRatings + rating) /
// //           (prev.totalRatings + 1),
// //         totalRatings: prev.totalRatings + 1,
// //       }));
// //     } else if (prevUserRating === rating) {
// //       // Remove rating (clicking same star)
// //       setUserRating(null);
// //       setRatingStats((prev) => ({
// //         averageRating:
// //           prev.totalRatings > 1
// //             ? (prev.averageRating * prev.totalRatings - rating) /
// //               (prev.totalRatings - 1)
// //             : 0,
// //         totalRatings: prev.totalRatings - 1,
// //       }));
// //     } else {
// //       // Update existing rating
// //       setUserRating(rating);
// //       setRatingStats((prev) => ({
// //         averageRating:
// //           (prev.averageRating * prev.totalRatings - prevUserRating + rating) /
// //           prev.totalRatings,
// //         totalRatings: prev.totalRatings,
// //       }));
// //     }

// //     const result = await setVideoRating(video.id, rating);
// //     if (!result.success) {
// //       // Revert optimistic updates
// //       setUserRating(prevUserRating);
// //       setRatingStats(prevRatingStats);

// //       toast.error("Failed to rate video", {
// //         description: result.message,
// //       });
// //     } else {
// //       // Update with actual data from server
// //       setRatingStats(result.data);
// //     }

// //     setIsLoading(false);
// //   };

// //   const renderStars = () => {
// //     const stars = [];
// //     const displayRating =
// //       hoveredRating !== null ? hoveredRating : userRating || 0;

// //     for (let i = 1; i <= 5; i++) {
// //       stars.push(
// //         <div key={i} className="relative">
// //           {/* Full star button */}
// //           <button
// //             className="relative focus:outline-none disabled:cursor-not-allowed transition-all duration-150"
// //             disabled={isLoading}
// //             onMouseEnter={() => setHoveredRating(i)}
// //             onMouseLeave={() => setHoveredRating(null)}
// //             onClick={() => handleRating(i)}
// //           >
// //             <Star
// //               size={20}
// //               className={`transition-colors duration-150 ${
// //                 displayRating >= i
// //                   ? "fill-yellow-400 text-yellow-400"
// //                   : "fill-transparent text-gray-300 hover:text-yellow-400"
// //               }`}
// //             />
// //           </button>

// //           {/* Half star overlay button */}
// //           <button
// //             className="absolute left-0 top-0 w-1/2 h-full focus:outline-none disabled:cursor-not-allowed z-10"
// //             disabled={isLoading}
// //             onMouseEnter={() => setHoveredRating(i - 0.5)}
// //             onMouseLeave={() => setHoveredRating(null)}
// //             onClick={() => handleRating(i - 0.5)}
// //           >
// //             <div className="w-1/2 h-full overflow-hidden">
// //               <Star
// //                 size={20}
// //                 className={`transition-colors duration-150 ${
// //                   displayRating >= i - 0.5 && displayRating < i
// //                     ? "fill-yellow-400 text-yellow-400"
// //                     : "fill-transparent text-transparent"
// //                 }`}
// //               />
// //             </div>
// //           </button>
// //         </div>
// //       );
// //     }

// //     return stars;
// //   };

// //   return (
// //     <div className="space-y-4">
// //       {/* Title and Class Level */}
// //       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
// //         <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
// //           {video.title}
// //         </h1>
// //         <div className="flex-shrink-0">
// //           <span className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium">
// //             Niveau : {video.class}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Branches */}
// //       {video.branch && video.branch.length > 0 && (
// //         <div className="space-y-2">
// //           <p className="text-sm rounded-full">
// //             Pour les élèves des branches suivantes :
// //           </p>
// //           <div className="flex flex-wrap gap-2">
// //             {video.branch.map((branch, idx) => (
// //               <span
// //                 key={idx}
// //                 className="inline-block px-2 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs"
// //               >
// //                 {branch}
// //               </span>
// //             ))}
// //           </div>
// //         </div>
// //       )}

// //       {/* Views and Time */}
// //       <div className="flex flex-wrap items-center gap-4 text-sm">
// //         <div className="flex items-center gap-2">
// //           {theme === "dark" ? (
// //             <Image
// //               src="/icons/views-dark.svg"
// //               alt="Views"
// //               width={16}
// //               height={16}
// //             />
// //           ) : (
// //             <Image src="/icons/views.svg" alt="Views" width={16} height={16} />
// //           )}
// //           <span className="text-primary-900 dark:text-primary-100">
// //             {video.views} views
// //           </span>
// //         </div>

// //         <div className="flex items-center gap-2">
// //           {theme === "dark" ? (
// //             <FaClockRotateLeft size={16} />
// //           ) : (
// //             <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
// //           )}
// //           <span className="text-primary-900 dark:text-primary-100">
// //             {formatDistanceToNow(new Date(video.created_at), {
// //               addSuffix: true,
// //             })}
// //           </span>
// //         </div>
// //       </div>

// //       {/* Teacher Info and Actions */}
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         {/* Teacher Info */}
// //         <Link
// //           href={`/profile/${video.teacher.id}`}
// //           target="_blank"
// //           className="flex items-center gap-3 hover:opacity-90 transition-opacity"
// //         >
// //           {video.teacher.profile_url ? (
// //             <Image
// //               src={video.teacher.profile_url}
// //               alt={video.teacher.first_name}
// //               width={40}
// //               height={40}
// //               className="w-10 h-10 rounded-full object-cover"
// //             />
// //           ) : (
// //             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
// //               <span className="text-primary-900 dark:text-primary-100 font-medium text-sm">
// //                 {video.teacher.first_name.charAt(0)}
// //                 {video.teacher.last_name?.charAt(0)}
// //               </span>
// //             </div>
// //           )}
// //           <div>
// //             <p className="font-medium text-sm">
// //               {video.teacher.first_name} {video.teacher.last_name}
// //             </p>
// //           </div>
// //         </Link>

// //         <div className="flex items-center gap-4">
// //           {/* Star Rating */}
// //           <div className="flex items-center gap-2">
// //             <div className="flex items-center">{renderStars()}</div>
// //             <div className="flex flex-col items-start text-xs text-gray-600 dark:text-gray-400 ml-2">
// //               <span>{ratingStats.averageRating.toFixed(1)}</span>
// //               <span>({ratingStats.totalRatings})</span>
// //             </div>
// //           </div>

// //           <ShareLink isLoading={isLoading} />
// //         </div>
// //       </div>

// //       <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
// //     </div>
// //   );
// // }
// // // "use client";

// // // import {
// // //   getUserRating,
// // //   getVideoRatingStats,
// // //   setVideoRating,
// // // } from "@/actions/videos/likes";
// // // import { Button } from "@/components/ui/button";
// // // import { formatDistanceToNow } from "date-fns";
// // // import { Star } from "lucide-react";
// // // import { useTheme } from "next-themes";
// // // import Image from "next/image";
// // // import Link from "next/link";
// // // import { useEffect, useState } from "react";
// // // import { FaClockRotateLeft } from "react-icons/fa6";
// // // import { toast } from "sonner";
// // // import ShareLink from "./ShareLink";

// // // interface VideoInfoProps {
// // //   readonly video: {
// // //     readonly id: string;
// // //     readonly title: string;
// // //     readonly created_at: string;
// // //     readonly views: number;
// // //     readonly class: string;
// // //     readonly branch: string[];
// // //     readonly teacher: {
// // //       id: string;
// // //       first_name: string;
// // //       last_name?: string;
// // //       profile_url: string | null;
// // //     };
// // //   };
// // // }

// // // export default function VideoInfo({ video }: VideoInfoProps) {
// // //   const [ratingStats, setRatingStats] = useState({
// // //     averageRating: 0,
// // //     totalRatings: 0,
// // //   });
// // //   const [userRating, setUserRating] = useState<number | null>(null);
// // //   const [hoveredRating, setHoveredRating] = useState<number | null>(null);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const { theme } = useTheme();

// // //   useEffect(() => {
// // //     const fetchRatingData = async () => {
// // //       const [{ data: statsData }, { data: userRatingData }] = await Promise.all(
// // //         [getVideoRatingStats(video.id), getUserRating(video.id)]
// // //       );

// // //       setRatingStats(statsData);
// // //       setUserRating(userRatingData);
// // //     };

// // //     fetchRatingData();
// // //   }, [video.id]);

// // //   const handleRating = async (rating: number) => {
// // //     setIsLoading(true);

// // //     const prevUserRating = userRating;
// // //     const prevRatingStats = { ...ratingStats };

// // //     // Optimistically update UI
// // //     if (prevUserRating === null) {
// // //       // New rating
// // //       setUserRating(rating);
// // //       setRatingStats((prev) => ({
// // //         averageRating:
// // //           (prev.averageRating * prev.totalRatings + rating) /
// // //           (prev.totalRatings + 1),
// // //         totalRatings: prev.totalRatings + 1,
// // //       }));
// // //     } else if (prevUserRating === rating) {
// // //       // Remove rating (clicking same star)
// // //       setUserRating(null);
// // //       setRatingStats((prev) => ({
// // //         averageRating:
// // //           prev.totalRatings > 1
// // //             ? (prev.averageRating * prev.totalRatings - rating) /
// // //               (prev.totalRatings - 1)
// // //             : 0,
// // //         totalRatings: prev.totalRatings - 1,
// // //       }));
// // //     } else {
// // //       // Update existing rating
// // //       setUserRating(rating);
// // //       setRatingStats((prev) => ({
// // //         averageRating:
// // //           (prev.averageRating * prev.totalRatings - prevUserRating + rating) /
// // //           prev.totalRatings,
// // //         totalRatings: prev.totalRatings,
// // //       }));
// // //     }

// // //     const result = await setVideoRating(video.id, rating);
// // //     if (!result.success) {
// // //       // Revert optimistic updates
// // //       setUserRating(prevUserRating);
// // //       setRatingStats(prevRatingStats);

// // //       toast.error("Failed to rate video", {
// // //         description: result.message,
// // //       });
// // //     } else {
// // //       // Update with actual data from server
// // //       setRatingStats(result.data);
// // //     }

// // //     setIsLoading(false);
// // //   };

// // //   const renderStars = () => {
// // //     const stars = [];
// // //     const displayRating = hoveredRating || userRating || 0;

// // //     for (let i = 1; i <= 5; i++) {
// // //       const isFilled = displayRating >= i;
// // //       const isHalfFilled = displayRating >= i - 0.5 && displayRating < i;

// // //       stars.push(
// // //         <button
// // //           key={i}
// // //           className="relative focus:outline-none disabled:cursor-not-allowed"
// // //           disabled={isLoading}
// // //           onMouseEnter={() => setHoveredRating(i)}
// // //           onMouseLeave={() => setHoveredRating(null)}
// // //           onClick={() => handleRating(i)}
// // //         >
// // //           <Star
// // //             size={20}
// // //             className={`transition-colors ${
// // //               isFilled
// // //                 ? "fill-yellow-400 text-yellow-400"
// // //                 : isHalfFilled
// // //                 ? "fill-yellow-400/50 text-yellow-400"
// // //                 : "text-gray-300 hover:text-yellow-400"
// // //             }`}
// // //           />
// // //         </button>
// // //       );

// // //       // Add half-star button
// // //       if (i < 5) {
// // //         stars.push(
// // //           <button
// // //             key={`${i}-half`}
// // //             className="relative focus:outline-none disabled:cursor-not-allowed -ml-2 z-10"
// // //             disabled={isLoading}
// // //             onMouseEnter={() => setHoveredRating(i + 0.5)}
// // //             onMouseLeave={() => setHoveredRating(null)}
// // //             onClick={() => handleRating(i + 0.5)}
// // //           >
// // //             <div className="w-2 h-5 overflow-hidden">
// // //               <Star
// // //                 size={20}
// // //                 className={`transition-colors ${
// // //                   displayRating >= i + 0.5
// // //                     ? "fill-yellow-400 text-yellow-400"
// // //                     : "text-transparent hover:text-yellow-400"
// // //                 }`}
// // //               />
// // //             </div>
// // //           </button>
// // //         );
// // //       }
// // //     }

// // //     return stars;
// // //   };

// // //   return (
// // //     <div className="space-y-4">
// // //       {/* Title and Class Level */}
// // //       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
// // //         <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
// // //           {video.title}
// // //         </h1>
// // //         <div className="flex-shrink-0">
// // //           <span className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium">
// // //             Niveau : {video.class}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* Branches */}
// // //       {video.branch && video.branch.length > 0 && (
// // //         <div className="space-y-2">
// // //           <p className="text-sm rounded-full">
// // //             Pour les élèves des branches suivantes :
// // //           </p>
// // //           <div className="flex flex-wrap gap-2">
// // //             {video.branch.map((branch, idx) => (
// // //               <span
// // //                 key={idx}
// // //                 className="inline-block px-2 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs"
// // //               >
// // //                 {branch}
// // //               </span>
// // //             ))}
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Views and Time */}
// // //       <div className="flex flex-wrap items-center gap-4 text-sm">
// // //         <div className="flex items-center gap-2">
// // //           {theme === "dark" ? (
// // //             <Image
// // //               src="/icons/views-dark.svg"
// // //               alt="Views"
// // //               width={16}
// // //               height={16}
// // //             />
// // //           ) : (
// // //             <Image src="/icons/views.svg" alt="Views" width={16} height={16} />
// // //           )}
// // //           <span className="text-primary-900 dark:text-primary-100">
// // //             {video.views} views
// // //           </span>
// // //         </div>

// // //         <div className="flex items-center gap-2">
// // //           {theme === "dark" ? (
// // //             <FaClockRotateLeft size={16} />
// // //           ) : (
// // //             <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
// // //           )}
// // //           <span className="text-primary-900 dark:text-primary-100">
// // //             {formatDistanceToNow(new Date(video.created_at), {
// // //               addSuffix: true,
// // //             })}
// // //           </span>
// // //         </div>
// // //       </div>

// // //       {/* Teacher Info and Actions */}
// // //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // //         {/* Teacher Info */}
// // //         <Link
// // //           href={`/profile/${video.teacher.id}`}
// // //           target="_blank"
// // //           className="flex items-center gap-3 hover:opacity-90 transition-opacity"
// // //         >
// // //           {video.teacher.profile_url ? (
// // //             <Image
// // //               src={video.teacher.profile_url}
// // //               alt={video.teacher.first_name}
// // //               width={40}
// // //               height={40}
// // //               className="w-10 h-10 rounded-full object-cover"
// // //             />
// // //           ) : (
// // //             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
// // //               <span className="text-primary-900 dark:text-primary-100 font-medium text-sm">
// // //                 {video.teacher.first_name.charAt(0)}
// // //                 {video.teacher.last_name?.charAt(0)}
// // //               </span>
// // //             </div>
// // //           )}
// // //           <div>
// // //             <p className="font-medium text-sm">
// // //               {video.teacher.first_name} {video.teacher.last_name}
// // //             </p>
// // //           </div>
// // //         </Link>

// // //         <div className="flex items-center gap-4">
// // //           {/* Star Rating */}
// // //           <div className="flex items-center gap-2">
// // //             <div className="flex items-center gap-1">{renderStars()}</div>
// // //             <div className="flex flex-col items-start text-xs text-gray-600 dark:text-gray-400">
// // //               <span>{ratingStats.averageRating.toFixed(1)}</span>
// // //               <span>({ratingStats.totalRatings})</span>
// // //             </div>
// // //           </div>

// // //           <ShareLink isLoading={isLoading} />
// // //         </div>
// // //       </div>

// // //       <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
// // //     </div>
// // //   );
// // // }
// // // // "use client";

// // // // import {
// // // //   getUserLikeStatus,
// // // //   getVideoLikesCount,
// // // //   toggleVideoLike,
// // // // } from "@/actions/videos/likes";
// // // // import { Button } from "@/components/ui/button";
// // // // import { formatDistanceToNow } from "date-fns";
// // // // import { ThumbsDown, ThumbsUp } from "lucide-react";
// // // // import { useTheme } from "next-themes";
// // // // import Image from "next/image";
// // // // import Link from "next/link";
// // // // import { useEffect, useState } from "react";
// // // // import { FaClockRotateLeft } from "react-icons/fa6";
// // // // import { toast } from "sonner";
// // // // import ShareLink from "./ShareLink";
// // // // interface VideoInfoProps {
// // // //   readonly video: {
// // // //     readonly id: string;
// // // //     readonly title: string;
// // // //     readonly created_at: string;
// // // //     readonly views: number;
// // // //     readonly class: string;
// // // //     readonly branch: string[];
// // // //     readonly teacher: {
// // // //       id: string;
// // // //       first_name: string;
// // // //       last_name?: string;
// // // //       profile_url: string | null;
// // // //     };
// // // //   };
// // // // }

// // // // export default function VideoInfo({ video }: VideoInfoProps) {
// // // //   const [likesCount, setLikesCount] = useState({ likes: 0, dislikes: 0 });
// // // //   const [userLikeStatus, setUserLikeStatus] = useState<boolean | null>(null);
// // // //   const [isLoading, setIsLoading] = useState(false);
// // // //   const { theme } = useTheme();
// // // //   useEffect(() => {
// // // //     const fetchLikesData = async () => {
// // // //       const [{ data: likesData }, { data: userStatus }] = await Promise.all([
// // // //         getVideoLikesCount(video.id),
// // // //         getUserLikeStatus(video.id),
// // // //       ]);

// // // //       setLikesCount(likesData);
// // // //       setUserLikeStatus(userStatus);
// // // //     };

// // // //     fetchLikesData();
// // // //   }, [video.id]);

// // // //   const handleLike = async (isLike: boolean) => {
// // // //     setIsLoading(true);

// // // //     const prevUserLikeStatus = userLikeStatus;
// // // //     const prevLikesCount = { ...likesCount };

// // // //     if (userLikeStatus === isLike) {
// // // //       setUserLikeStatus(null);
// // // //       if (isLike) {
// // // //         setLikesCount((prev) => ({ ...prev, likes: prev.likes - 1 }));
// // // //       } else {
// // // //         setLikesCount((prev) => ({ ...prev, dislikes: prev.dislikes - 1 }));
// // // //       }
// // // //     } else if (userLikeStatus === null) {
// // // //       setUserLikeStatus(isLike);
// // // //       if (isLike) {
// // // //         setLikesCount((prev) => ({ ...prev, likes: prev.likes + 1 }));
// // // //       } else {
// // // //         setLikesCount((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }));
// // // //       }
// // // //     } else {
// // // //       setUserLikeStatus(isLike);
// // // //       if (isLike) {
// // // //         setLikesCount((prev) => ({
// // // //           likes: prev.likes + 1,
// // // //           dislikes: prev.dislikes - 1,
// // // //         }));
// // // //       } else {
// // // //         setLikesCount((prev) => ({
// // // //           likes: prev.likes - 1,
// // // //           dislikes: prev.dislikes + 1,
// // // //         }));
// // // //       }
// // // //     }

// // // //     const result = await toggleVideoLike(video.id, isLike);
// // // //     if (!result.success) {
// // // //       setUserLikeStatus(prevUserLikeStatus);
// // // //       setLikesCount(prevLikesCount);

// // // //       toast.error("Failed to like/dislike video", {
// // // //         description: result.message,
// // // //       });
// // // //     }

// // // //     setIsLoading(false);
// // // //   };

// // // //   return (
// // // //     <div className="space-y-4">
// // // //       {/* Title and Class Level */}
// // // //       <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
// // // //         <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
// // // //           {video.title}
// // // //         </h1>
// // // //         <div className="flex-shrink-0">
// // // //           <span className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium">
// // // //             Niveau : {video.class}
// // // //           </span>
// // // //         </div>
// // // //       </div>

// // // //       {/* Branches */}
// // // //       {video.branch && video.branch.length > 0 && (
// // // //         <div className="space-y-2">
// // // //           <p className="text-sm  rounded-full">
// // // //             Pour les élèves des branches suivantes :
// // // //           </p>
// // // //           <div className="flex flex-wrap gap-2">
// // // //             {video.branch.map((branch, idx) => (
// // // //               <span
// // // //                 key={idx}
// // // //                 // className="px-2 py-1 bg-secondary/50  text-primary-900   dark:text-primary-100 rounded-md text-xs"
// // // //                 className="inline-block px-2 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs "
// // // //               >
// // // //                 {branch}
// // // //               </span>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}

// // // //       {/* Views and Time */}
// // // //       <div className="flex flex-wrap items-center gap-4 text-sm">
// // // //         <div className="flex items-center gap-2">
// // // //           {theme === "dark" ? (
// // // //             <Image
// // // //               src="/icons/views-dark.svg"
// // // //               alt="Views"
// // // //               width={16}
// // // //               height={16}
// // // //             />
// // // //           ) : (
// // // //             <Image src="/icons/views.svg" alt="Views" width={16} height={16} />
// // // //           )}
// // // //           <span className=" text-primary-900   dark:text-primary-100">
// // // //             {video.views} views
// // // //           </span>
// // // //         </div>

// // // //         <div className="flex items-center gap-2">
// // // //           {theme === "dark" ? (
// // // //             <FaClockRotateLeft size={16} />
// // // //           ) : (
// // // //             <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
// // // //           )}
// // // //           <span className=" text-primary-900   dark:text-primary-100">
// // // //             {formatDistanceToNow(new Date(video.created_at), {
// // // //               addSuffix: true,
// // // //             })}
// // // //           </span>
// // // //         </div>
// // // //       </div>

// // // //       {/* Teacher Info and Actions */}
// // // //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// // // //         {/* Teacher Info */}
// // // //         <Link
// // // //           href={`/profile/${video.teacher.id}`}
// // // //           target="_blank"
// // // //           className="flex items-center gap-3 hover:opacity-90 transition-opacity"
// // // //         >
// // // //           {video.teacher.profile_url ? (
// // // //             <Image
// // // //               src={video.teacher.profile_url}
// // // //               alt={video.teacher.first_name}
// // // //               width={40}
// // // //               height={40}
// // // //               className="w-10 h-10 rounded-full object-cover"
// // // //             />
// // // //           ) : (
// // // //             <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
// // // //               <span className="text-primary-900   dark:text-primary-100 font-medium text-sm">
// // // //                 {video.teacher.first_name.charAt(0)}
// // // //                 {video.teacher.last_name?.charAt(0)}
// // // //               </span>
// // // //             </div>
// // // //           )}
// // // //           <div>
// // // //             <p className="font-medium text-sm">
// // // //               {video.teacher.first_name} {video.teacher.last_name}
// // // //             </p>
// // // //           </div>
// // // //         </Link>

// // // //         <div className="flex items-center gap-4 ">
// // // //           <div className="flex items-center gap-1">
// // // //             <Button
// // // //               variant="ghost"
// // // //               size="icon"
// // // //               className={`flex items-center gap-1  ${
// // // //                 userLikeStatus === true ? "text-blue-600" : ""
// // // //               }`}
// // // //               onClick={() => handleLike(true)}
// // // //               disabled={isLoading}
// // // //             >
// // // //               <ThumbsUp size={19} />
// // // //               <span>{likesCount.likes}</span>
// // // //             </Button>

// // // //             <Button
// // // //               variant="ghost"
// // // //               size="icon"
// // // //               className={`flex items-center gap-1 ${
// // // //                 userLikeStatus === false ? "text-red-600" : ""
// // // //               }`}
// // // //               onClick={() => handleLike(false)}
// // // //               disabled={isLoading}
// // // //             >
// // // //               <ThumbsDown size={19} />
// // // //               <span>{likesCount.dislikes}</span>
// // // //             </Button>
// // // //           </div>

// // // //           {/* Like/Dislike and Share Actions */}

// // // //           <ShareLink isLoading={isLoading} />
// // // //         </div>
// // // //       </div>

// // // //       <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
// // // //     </div>
// // // //   );
// // // // }
