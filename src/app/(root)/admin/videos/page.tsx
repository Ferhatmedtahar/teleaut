import VideosList from "../_components/videos/VideoList";
import { getVideosList } from "../_lib/admin";

export default async function VideosListPage() {
  const { data: videos } = await getVideosList();

  if (!videos) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">No Videos Found</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VideosList videos={videos} />
    </div>
  );
}
