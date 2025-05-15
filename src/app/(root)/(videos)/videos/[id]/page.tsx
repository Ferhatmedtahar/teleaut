import { getVideoById, incrementVideoView } from "@/actions/videos/action";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import CommentSection from "../../_components/CommentSection";
import DocumentsTab from "../../_components/DocumentsTab";
import RelatedVideos from "../../_components/RelatedVideos";
import VideoDescription from "../../_components/VideoDescription";
import VideoInfo from "../../_components/VideoInfo";
import VideoPlayer from "../../_components/VideoPlayer";
import VideoSkeleton from "../../_components/VideoSkeleton";

export default async function VideoPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await incrementVideoView(id);

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Suspense fallback={<VideoSkeleton />}>
        <VideoContent id={id} />
      </Suspense>
    </div>
  );
}

async function VideoContent({ id }: { id: string }) {
  const video = await getVideoById(id);

  if (!video) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <VideoPlayer
          videoUrl={video.video_url}
          thumbnailUrl={video.thumbnail_url}
        />
        <VideoInfo video={video} />
        <VideoDescription description={video.description} />
        <CommentSection videoId={video.id} />
      </div>
      <div className="lg:col-span-1">
        <div className="mb-6">
          <DocumentsTab
            documentsUrl={video.documents_url}
            notesUrl={video.notes_url}
          />
        </div>
        <RelatedVideos
          currentVideoId={video.id}
          subject={video.subject}
          classValue={video.class}
        />
      </div>
    </div>
  );
}
