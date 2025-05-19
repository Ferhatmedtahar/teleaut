import { getSuggestedVideos } from "@/actions/profile/getSugguestionsStudentAll.action";
import VideoCard from "./VideoCard";

export default async function VideosListSugguestion({
  userId,
  userClass,
  userBranch,
}: {
  readonly userId: string;
  readonly userClass: string;
  readonly userBranch?: string;
}) {
  const {
    success,
    videos: suggestedVideosResponse,
    message,
  } = await getSuggestedVideos(userId, userClass, userBranch);

  return (
    <div className="space-y-8 ">
      {/* Suggested Videos Section */}
      <section>
        {success ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {suggestedVideosResponse?.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">{message}</p>
        )}
      </section>
    </div>
  );
}
