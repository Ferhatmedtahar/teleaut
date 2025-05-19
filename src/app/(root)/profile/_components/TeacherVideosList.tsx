import { getTeacherVideos } from "@/actions/profile/getTeacherVideos.action";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { UserProps } from "@/types/UserProps";
import ExplorerVideo from "../../(videos)/_components/videos/ExplorerVideo";

export default async function TeacherVideosList({
  user,
}: {
  readonly user: UserProps;
}) {
  const { success, videos } = await getTeacherVideos(user.id);

  if (!success) return null;
  if (!videos) return <p className="">Teacher has no videos yet!</p>;

  return (
    <div className="p-8 flex flex-col gap-4 ">
      <h2 className="text-2xl lg:text-3xl font-semibold">Your Videos</h2>
      <div className="grid md:grid-cols-3 gap-6  w-full ">
        {videos.length !== 0 ? (
          videos.map((video: RelatedVideo) => (
            <ExplorerVideo key={video.id} video={video} user={user} />
          ))
        ) : (
          <p className="">Teacher has no videos yet!</p>
        )}
      </div>
    </div>
  );
}
