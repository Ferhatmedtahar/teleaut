import { formatDate } from "@/lib/helpers/formatDate";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import Image from "next/image";
import Link from "next/link";
export default function VideoHistory({
  video,
}: {
  readonly video: RelatedVideo;
}) {
  return (
    <div
      key={video.id}
      className="flex border-b border-border/20 dark:border-border/90 pb-4"
    >
      <div className="relative h-[90px] w-[160px] flex-shrink-0">
        <Link href={`/videos/${video.id}`}>
          <Image
            src={video.thumbnail_url ?? "/images/placeholder-thumbnail.jpg"}
            alt={video.title}
            fill
            className="object-cover rounded-md"
          />
          {/* hover:cursor-pointer */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-border/90 hover:bg-border transition-colors duration-150  bg-opacity-80 rounded-full p-2">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8 5V19L19 12L8 5Z" fill="white" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      <div className="ml-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-medium text-base">{video.title}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {video.branch.length > 0 && (
              <span
                // className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs font-medium"
              >
                {video.branch.join(", ")}
              </span>
            )}
            {video.class && (
              <span
                //  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs font-medium"
              >
                {video.class}
              </span>
            )}
            {video.subject && (
              <span
                // className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                className="inline-block px-3 py-1 rounded-full bg-primary-100/90 text-primary-900 dark:bg-primary-900/30 dark:text-primary-100 text-xs font-medium"
              >
                {video.subject}
              </span>
            )}
          </div>
        </div>
        <div className="text-sm text-primary-900   dark:text-primary-100  mt-1">
          <p>
            Date du post : {formatDate(video.created_at)} · {video.views} vues
          </p>
          <p>
            Professeur: {video.teacher.first_name}{" "}
            {video.teacher.last_name || ""}
          </p>
        </div>
      </div>
    </div>
  );
}
