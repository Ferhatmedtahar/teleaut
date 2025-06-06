import { formatDate } from "@/lib/helpers/formatDate";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import Image from "next/image";
import Link from "next/link";

export default function VideoHistory({
  video,
}: {
  readonly video: RelatedVideo;
}) {
  const renderBranches = () => {
    if (!video.branch || video.branch.length === 0) return null;

    const visibleBranches = video.branch.slice(0, 2);
    const remainingCount = video.branch.length - 2;

    return (
      <div className="flex flex-wrap gap-1">
        {visibleBranches.map((branch, index) => (
          <span
            key={index}
            className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary-100/70 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs font-medium"
          >
            {branch &&
            remainingCount > 0 &&
            index === visibleBranches.length - 1
              ? `${branch} ...+${remainingCount}`
              : branch}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div
      key={video.id}
      className="flex flex-col sm:flex-row border-b border-border/20 dark:border-border/90 pb-3 sm:pb-4 gap-3 sm:gap-4"
    >
      {/* Video Thumbnail */}
      <div className="relative h-[180px] sm:h-[90px] w-full sm:w-[160px] flex-shrink-0">
        <Link href={`/videos/${video.id}`}>
          <Image
            src={video.thumbnail_url ?? "/images/placeholder-thumbnail.jpg"}
            alt={video.title}
            fill
            className="object-cover rounded-md"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-border/90 hover:bg-border transition-colors duration-150 bg-opacity-80 rounded-full p-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-6 sm:h-6"
              >
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Video Info */}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-medium text-sm sm:text-base line-clamp-2 leading-tight">
            {video.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {/* Branches with +X more logic */}
            {renderBranches()}

            {/* Class */}
            {video.class && (
              <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary-100/70 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs font-medium">
                {video.class}
              </span>
            )}

            {/* Subject */}
            {video.subject && (
              <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-primary-100/70 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs font-medium">
                {video.subject}
              </span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="text-xs sm:text-sm text-primary-900 dark:text-primary-100 mt-2 space-y-1">
          <p className="truncate">
            Date du post : {formatDate(video.created_at)} · {video.views} vues
          </p>
          <p className="truncate">
            Professeur: {video.teacher.first_name}{" "}
            {video.teacher.last_name || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
