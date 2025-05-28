import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { addToHistory } from "@/actions/history/addToHistory.action";
import { getVideoById } from "@/actions/videos/getVideoById";
import { incrementVideoView } from "@/actions/videos/views";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import DocumentsCommentsTab from "../../_components/comments/DocumentsTab";
import RelatedVideos from "../../_components/videos/RelatedVideos";
import VideoDescription from "../../_components/videos/VideoDescription";
import VideoInfo from "../../_components/videos/VideoInfo";
import VideoPlayer from "../../_components/videos/VIdeoPlayer";
import VideoSkeleton from "../../_components/videos/VideoSkeleton";

export default async function VideoPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { success, user } = await getCurrentUser();
  if (!success || !user) {
    notFound();
  }
  const [_, history] = await Promise.all([
    await incrementVideoView(id),
    await addToHistory(user.id, id),
  ]);
  if (!history.success) {
    console.error("Error adding video to history:", history.message);
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Suspense fallback={<VideoSkeleton />}>
        <VideoContent id={id} />
      </Suspense>
    </div>
  );
}

async function VideoContent({ id }: { readonly id: string }) {
  const { success, data: video } = await getVideoById(id);

  if (!success) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 w-full">
      {/* Video Section - Always first on mobile, left column on desktop */}
      <div className="order-1 lg:col-span-2 flex flex-col gap-3">
        <VideoPlayer
          videoUrl={video.video_url}
          thumbnailUrl={video.thumbnail_url}
        />
        <VideoInfo video={video} />
        <VideoDescription description={video.description} />
      </div>

      {/* Documents/Comments Section - Second on mobile, right column on desktop */}
      <div className="order-2 lg:order-2 lg:col-span-1 flex flex-col gap-3">
        <div className="mb-6">
          <DocumentsCommentsTab
            documentsUrl={video.documents_url}
            notesUrl={video.notes_url}
            currentVideoId={video.id}
          />
        </div>
      </div>

      {/* Related Videos Section - Last on both mobile and desktop */}
      <div className="order-3 lg:order-3 lg:col-span-3">
        <RelatedVideos
          currentVideoId={video.id}
          subject={video.subject}
          classValue={video.class}
        />
      </div>
    </div>
  );
}
