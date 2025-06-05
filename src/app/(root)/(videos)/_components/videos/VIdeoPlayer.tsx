"use client";

import { useEffect, useState } from "react";

export default function VideoPlayer({
  videoUrl,
  thumbnailUrl,
}: {
  readonly videoUrl: string;
  readonly thumbnailUrl?: string | null;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Enhanced URL parameters for better mobile experience
  const getVideoUrl = () => {
    const baseUrl = videoUrl.split("?")[0];
    const params = new URLSearchParams({
      autoplay: "true",
      loop: "true",
      muted: "false",
      responsive: "true",

      controls: "true",
      playsinline: "true",
      "ui-language": "en",
      "ui-seek-time": "10",
      // Better mobile UI
      "ui-hide-cursor": "true",
      "ui-theater-mode": "false",
      // // Performance optimizations
      quality: isMobile ? "auto" : "source",
      "buffer-size": isMobile ? "5" : "10",
    });

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="relative w-full group">
      <div
        className="relative w-full overflow-hidden rounded-lg bg-black/5"
        style={{
          paddingTop: isMobile ? "75%" : "56.25%",
        }}
      >
        {!isLoaded && thumbnailUrl && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url(${thumbnailUrl})` }}
          >
            <div className="w-16 h-16 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <div className="w-0 h-0 border-l-[12px] border-l-white border-y-[8px] border-y-transparent ml-1"></div>
            </div>
          </div>
        )}

        <iframe
          title="Video Player"
          src={getVideoUrl()}
          className={`
            absolute top-0 left-0 h-full w-full
            rounded-lg border border-border/20 dark:border-border/90 bg-border/80 
            transition-opacity duration-300
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          {...(isMobile && {
            scrolling: "no",
            style: {
              maxHeight: "100vh",
              objectFit: "contain",
            },
          })}
        />

        {isMobile && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        )}
      </div>

      {isMobile && (
        <div className="mt-2 flex justify-center">
          <p className="text-xs text-muted-foreground text-center px-4">
            Appuyez sur la vidéo pour la lire • Appuyez deux fois pour passer en
            plein écran
          </p>
        </div>
      )}
    </div>
  );
}
