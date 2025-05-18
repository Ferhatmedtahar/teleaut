import {
  getPopularVideos,
  getSuggestedVideos,
} from "@/actions/profile/getSugguestionsStudentAll.action";
import VideoCard from "./VideoCard";

export default async function VideosListSugguestion({
  userId,
  userClass,
  userBranch,
}: {
  userId: string;
  userClass: string;
  userBranch?: string;
}) {
  const suggestedVideosResponse = await getSuggestedVideos(
    userId,
    userClass,
    userBranch
  );
  const {
    success,
    videos: popularVideosResponse,
    message,
  } = await getPopularVideos(userClass, userBranch);

  if (popularVideosResponse?.length === 0) return null;

  return (
    <div className="space-y-8">
      {/* Suggested Videos Section */}
      <section>
        <h3 className="text-lg font-medium mb-4">Vidéos recommandées</h3>
        {success ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularVideosResponse?.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            {suggestedVideosResponse.message}
          </p>
        )}
      </section>

      {/* Popular Videos Section */}
      <section>
        <h3 className="text-lg font-medium mb-4">Vidéos populaires</h3>
        {success ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularVideosResponse?.map((video) => (
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
