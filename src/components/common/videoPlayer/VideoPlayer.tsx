"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  poster?: string;
  userId?: string;
  autoplay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export default function VideoPlayer({
  videoId,
  title,
  poster,
  userId,
  autoplay = false,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get video streaming URL from Bunny CDN
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        setIsLoading(true);

        const response = await fetch(`/api/videos/${videoId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch video details");
        }

        const data = await response.json();

        // Record view if userId is provided
        if (userId) {
          await fetch(`/api/videos/${videoId}/views`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
        }

        // Initialize video player with HLS stream
        if (videoRef.current && data.streamDetails) {
          setupHlsPlayer(
            data.streamDetails.hlsUrl ||
              `https://${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}/video/${videoId}/playlist.m3u8`
          );
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching video details:", err);
        setError("Failed to load video. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchVideoDetails();
  }, [videoId, userId]);

  // Initialize HLS player
  const setupHlsPlayer = (hlsUrl: string) => {
    if (!videoRef.current) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        startLevel: -1, // Auto quality selection based on bandwidth
        capLevelToPlayerSize: true,
        maxBufferLength: 30,
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (autoplay) {
          videoRef.current
            ?.play()
            .catch((e) => console.error("Autoplay prevented:", e));
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error("HLS error:", data);
          setError("Video playback error. Please try again.");
        }
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari which has native HLS support
      videoRef.current.src = hlsUrl;
      if (autoplay) {
        videoRef.current
          .play()
          .catch((e) => console.error("Autoplay prevented:", e));
      }
    } else {
      setError("Your browser does not support HLS video playback.");
    }
  };

  // Video event handlers
  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const seek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(videoRef.current.currentTime + seconds, duration)
      );
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      onTimeUpdate?.(videoRef.current.currentTime, duration);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64 bg-gray-900 text-white">
          <div className="text-center p-4">
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster={poster}
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              onEnded?.();
            }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
          />

          {/* Controls overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {title && <h3 className="text-white mb-2 font-medium">{title}</h3>}

            {/* Progress bar */}
            <div
              className="relative w-full h-1 bg-gray-600 rounded-full cursor-pointer mb-2"
              onClick={(e) => {
                if (videoRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  videoRef.current.currentTime = pos * duration;
                }
              }}
            >
              <div
                className="absolute top-0 left-0 h-full bg-blue-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Time display and controls */}
            <div className="flex items-center justify-between">
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="flex items-center space-x-4">
                <button onClick={() => seek(-10)} className="text-white">
                  <SkipBack size={20} />
                </button>

                <button
                  onClick={togglePlay}
                  className="text-white p-1 bg-blue-600 rounded-full"
                >
                  {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                </button>

                <button onClick={() => seek(10)} className="text-white">
                  <SkipForward size={20} />
                </button>

                <button onClick={toggleMute} className="text-white">
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
