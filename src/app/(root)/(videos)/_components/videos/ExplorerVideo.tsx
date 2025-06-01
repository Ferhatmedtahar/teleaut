"use client";

import { formatDistanceToNow } from "date-fns";
import { Clock, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  profile_url: string;
}

interface Video {
  id: string;
  title: string;
  class: string;
  subject: string;
  video_url: string;
  thumbnail_url: string;
  documents_url: string | null;
  notes_url: string | null;
  description: string;
  created_at: string;
  teacher_id: string;
  views: number;
  status: number;
  branch: string[] | null;
  teacher: Teacher;
}

interface ExplorerVideoProps {
  video: Video;
  user?: Teacher;
}

export default function ExplorerVideo({ video, user }: ExplorerVideoProps) {
  if (!video || !user) return null;

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <Link href={`/videos/${video.id}`} className="group block w-full h-full">
      <article className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-out group-hover:-translate-y-0.5 border border-slate-200/50 dark:border-slate-700/50 h-full flex flex-col">
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
          <Image
            src={video.thumbnail_url ?? "/images/placeholder-thumbnail.png"}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-104"
          />

          {/* Enhanced overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/15" />

          {/* Subject badge with enhanced contrast */}
          <div className="absolute top-3 left-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-950 text-white backdrop-blur-md border border-white/20 shadow-lg">
              {video.subject}
            </span>
          </div>

          {/* Class badge with enhanced contrast */}
          <div className="absolute top-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/90 text-slate-900 backdrop-blur-md border border-black/10 shadow-lg">
              {video.class}
            </span>
          </div>

          {/* Duration overlay with better visibility */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black/90 text-white backdrop-blur-md shadow-lg">
              <Clock className="w-3 h-3" />
              Watch
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors duration-200 mb-4">
            {video.title}
          </h3>

          {/* Teacher info - removed online indicator */}
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={user.profile_url ?? "/images/placeholder-profile.png"}
              alt={`${user.first_name} ${user.last_name}`}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                {user.first_name} {user.last_name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Teacher
              </p>
            </div>
          </div>

          {/* Branch tags */}
          {video.branch && video.branch.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {video.branch.slice(0, 2).map((branch, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 border border-teal-200/50 dark:border-teal-700/50"
                >
                  {branch}
                </span>
              ))}
              {video.branch.length > 2 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  +{video.branch.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats - simplified without status */}
          <div className="mt-auto">
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {formatViews(video.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {formatDistanceToNow(new Date(video.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

// "use client";

// import { RelatedVideo } from "@/types/RelatedVideos.interface";
// import { RelatedVideoUser } from "@/types/UserProps";
// import { formatDistanceToNow } from "date-fns";
// import Image from "next/image";
// import Link from "next/link";

// export default function ExplorerVideo({
//   video,
//   user,
// }: {
//   readonly video: RelatedVideo;
//   readonly user?: RelatedVideoUser;
// }) {
//   console.log("ExplorerVideo", video, user);
//   if (!video || !user) return null;
//   return (
//     <Link
//       href={`/videos/${video.id}`}
//       key={video.id}
//       className="group flex flex-col border border-border/30 dark:border-border/80 rounded-xl overflow-hidden h-full"
//     >
//       <div className="relative w-full aspect-video overflow-hidden">
//         <Image
//           src={video.thumbnail_url ?? "/images/placeholder-thumbnail.png"}
//           alt={video.title}
//           fill
//           className="object-cover group-hover:scale-102 transition-transform"
//         />
//         {/* {video.branch && video.branch.length > 0 && (
//           <p className=" absolute top-1 right-1 z-40 max-lg:hidden lg:px-2 lg:py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/20 dark:text-[#d9d9d9] text-xs">
//             {video.branch[0]}
//             {video.branch.length > 1 && `... +${video.branch.length - 1}`}
//           </p>
//         )} */}
//       </div>

//       <div className="flex flex-col justify-between flex-grow mt-2 px-2 pb-3 sm:pb-4  ">
//         <div>
//           <div className="flex justify-between pb-2">
//             <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">
//               {video.title}
//             </h3>

//             {video.branch && video.branch.length > 0 && (
//               <p className="max-lg:hidden lg:px-2 lg:py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/20 dark:text-primary-50 text-xs">
//                 {video.branch[0]}
//                 {video.branch.length > 1 && `... +${video.branch.length - 1}`}
//               </p>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <Image
//               src={user.profile_url ?? "/images/placeholder-profile.png"}
//               alt={user.first_name}
//               width={24}
//               height={24}
//               className="w-6 h-6 rounded-full object-cover"
//             />
//             <p className="text-xs lg:text-sm  text-primary-900  dark:text-primary-100  mt-1">
//               {user?.first_name} {user?.last_name}
//             </p>
//           </div>
//         </div>

//         <div className="flex items-center gap-1 text-xs lg:text-sm text-primary-900  dark:text-primary-100 mt-1">
//           <span>{video.views} views</span>
//           <span>•</span>
//           <span>
//             {formatDistanceToNow(new Date(video.created_at), {
//               addSuffix: true,
//             })}
//           </span>
//         </div>
//       </div>
//     </Link>
//     // <Link
//     //   href={`/videos/${video.id}`}
//     //   key={video.id}
//     //   className="group flex flex-col   border border-border/20 dark:border-border/90 rounded-xl overflow-hidden"
//     // >
//     //   <div className="relative w-full aspect-video overflow-hidden">
//     //     <Image
//     //       src={video.thumbnail_url ?? "/images/placeholder-thumbnail.png"}
//     //       alt={video.title}
//     //       fill
//     //       className="object-cover group-hover:scale-102 transition-transform"
//     //     />
//     //   </div>
//     //   {/* <div className="relative w-full aspect-video overflow-hidden group">
//     //     <Image
//     //       src={video.thumbnail_url ?? "/images/placeholder-thumbnail.png"}
//     //       alt={video.title}
//     //       fill
//     //       className="object-cover group-hover:scale-103 transition-transform"
//     //     />

//     //     {video.class && (
//     //       <p className="absolute top-2 right-2 px-2 py-1 bg-primary-100/90 text-primary-950 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//     //         {video.class}
//     //       </p>
//     //     )}
//     //   </div> */}
//     //   <div className="mt-2 px-2 pb-2">
//     //     <div className="flex justify-between pb-2">
//     //       <h3 className="font-semibold text-base line-clamp-2 group-hover:text-primary-800 dark:group-hover:text-primary-300 transition-colors">
//     //         {video.title}
//     //       </h3>

//     //       {video.branch && video.branch.length > 0 && (
//     //         <p className="max-lg:hidden  lg:px-2 lg:py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//     //           {video.branch[0]}
//     //           {video.branch.length > 1 && `... +${video.branch.length - 1}`}
//     //         </p>
//     //       )}
//     //     </div>
//     //     <div className="flex  items-center gap-2">
//     //       <Image
//     //         src={user.profile_url ?? "/images/placeholder-profile.png"}
//     //         alt={user.first_name}
//     //         width={24}
//     //         height={24}
//     //         className="w-6 h-6 rounded-full object-cover"
//     //       />
//     //       <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
//     //         {user?.first_name} {user?.last_name}
//     //       </p>
//     //     </div>

//     //     <div className="flex items-center gap-1 text-xs lg:text-sm text-gray-500 dark:text-gray-400 mt-1">
//     //       <span>{video.views} views</span>
//     //       <span>•</span>
//     //       <span>
//     //         {formatDistanceToNow(new Date(video.created_at), {
//     //           addSuffix: true,
//     //         })}
//     //       </span>
//     //     </div>
//     //   </div>
//     // </Link>
//   );
// }
