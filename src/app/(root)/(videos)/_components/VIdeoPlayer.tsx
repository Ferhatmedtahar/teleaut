"use client";

import { useEffect, useState } from "react";

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
}

export default function VideoPlayer({ src, title, poster }: VideoPlayerProps) {
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // Check if the source is a Bunny Stream URL (iframe embed)
    setIsIframe(src.includes("iframe.mediadelivery.net"));
  }, [src]);

  if (isIframe) {
    return (
      <div className="aspect-video w-full rounded-lg overflow-hidden">
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden">
      <video
        src={src}
        poster={poster}
        controls
        className="w-full h-full"
        preload="metadata"
      >
        <p>Your browser doesn&apos;t support HTML5 video.</p>
      </video>
    </div>
  );
}
