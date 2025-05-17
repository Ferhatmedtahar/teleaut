"use client";

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
}: {
  readonly videoUrl: string;
  readonly thumbnailUrl?: string | null;
}) {
  console.log("video url", videoUrl);

  return (
    <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
      <iframe
        title={videoUrl}
        src={`${videoUrl}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
        className="absolute top-0 left-0 h-full w-full  rounded-lg overflow-hidden border border-border/20"
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
        allowFullScreen
      ></iframe>
    </div>
  );
}
