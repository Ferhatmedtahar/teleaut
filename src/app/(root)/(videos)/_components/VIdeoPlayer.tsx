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

// "use client";

// import type React from "react";

// import {
//   Maximize,
//   Pause,
//   Play,
//   SkipBack,
//   SkipForward,
//   Volume2,
//   VolumeX,
// } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// interface VideoPlayerProps {
//   videoUrl: string;
//   thumbnailUrl?: string | null;
// }

// export default function VideoPlayer({
//   videoUrl,
//   thumbnailUrl,
// }: VideoPlayerProps) {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isMuted, setIsMuted] = useState(false);
//   const [volume, setVolume] = useState(1);
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const progressRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const updateTime = () => setCurrentTime(video.currentTime);
//     const updateDuration = () => setDuration(video.duration);
//     const handleEnded = () => setIsPlaying(false);

//     video.addEventListener("timeupdate", updateTime);
//     video.addEventListener("loadedmetadata", updateDuration);
//     video.addEventListener("ended", handleEnded);

//     return () => {
//       video.removeEventListener("timeupdate", updateTime);
//       video.removeEventListener("loadedmetadata", updateDuration);
//       video.removeEventListener("ended", handleEnded);
//     };
//   }, []);

//   const togglePlay = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (isPlaying) {
//       video.pause();
//     } else {
//       video.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const toggleMute = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     video.muted = !isMuted;
//     setIsMuted(!isMuted);
//   };

//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const video = videoRef.current;
//     if (!video) return;

//     const newVolume = Number.parseFloat(e.target.value);
//     video.volume = newVolume;
//     setVolume(newVolume);
//     setIsMuted(newVolume === 0);
//   };

//   const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     const video = videoRef.current;
//     const progress = progressRef.current;
//     if (!video || !progress) return;

//     const rect = progress.getBoundingClientRect();
//     const pos = (e.clientX - rect.left) / rect.width;
//     video.currentTime = pos * video.duration;
//   };

//   const handleFullscreen = () => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (document.fullscreenElement) {
//       document.exitFullscreen();
//     } else {
//       video.requestFullscreen();
//     }
//   };

//   const formatTime = (time: number) => {
//     const hours = Math.floor(time / 3600);
//     const minutes = Math.floor((time % 3600) / 60);
//     const seconds = Math.floor(time % 60);

//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
//         .toString()
//         .padStart(2, "0")}`;
//     }
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   const skipForward = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.currentTime = Math.min(video.duration, video.currentTime + 10);
//   };

//   const skipBackward = () => {
//     const video = videoRef.current;
//     if (!video) return;
//     video.currentTime = Math.max(0, video.currentTime - 10);
//   };

//   return (
//     <div className="relative w-full overflow-hidden rounded-lg aspect-video bg-black mb-4">
//       <video
//         ref={videoRef}
//         src={videoUrl}
//         poster={thumbnailUrl || undefined}
//         className="w-full h-full"
//         onClick={togglePlay}
//         preload="metadata"
//       />

//       {/* Video Controls */}
//       <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
//         {/* Progress Bar */}
//         <div
//           ref={progressRef}
//           className="w-full h-1 bg-gray-600 rounded-full mb-4 cursor-pointer"
//           onClick={handleProgressClick}
//         >
//           <div
//             className="h-full bg-red-600 rounded-full relative"
//             style={{ width: `${(currentTime / duration) * 100}%` }}
//           >
//             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full transform translate-x-1/2" />
//           </div>
//         </div>

//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <button
//               onClick={togglePlay}
//               className="p-2 rounded-full hover:bg-white/10 text-white"
//               aria-label={isPlaying ? "Pause" : "Play"}
//             >
//               {isPlaying ? <Pause size={20} /> : <Play size={20} />}
//             </button>

//             <button
//               onClick={skipBackward}
//               className="p-2 rounded-full hover:bg-white/10 text-white"
//               aria-label="Skip backward 10 seconds"
//             >
//               <SkipBack size={20} />
//             </button>

//             <button
//               onClick={skipForward}
//               className="p-2 rounded-full hover:bg-white/10 text-white"
//               aria-label="Skip forward 10 seconds"
//             >
//               <SkipForward size={20} />
//             </button>

//             <div className="flex items-center gap-2 ml-2">
//               <button
//                 onClick={toggleMute}
//                 className="p-2 rounded-full hover:bg-white/10 text-white"
//                 aria-label={isMuted ? "Unmute" : "Mute"}
//               >
//                 {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
//               </button>

//               <input
//                 type="range"
//                 min="0"
//                 max="1"
//                 step="0.01"
//                 value={volume}
//                 onChange={handleVolumeChange}
//                 className="w-20 accent-red-600"
//               />
//             </div>

//             <span className="text-white text-sm ml-2">
//               {formatTime(currentTime)} / {formatTime(duration)}
//             </span>
//           </div>

//           <button
//             onClick={handleFullscreen}
//             className="p-2 rounded-full hover:bg-white/10 text-white"
//             aria-label="Fullscreen"
//           >
//             <Maximize size={20} />
//           </button>
//         </div>
//       </div>

//       {/* Play button overlay when paused */}
//       {!isPlaying && (
//         <button
//           onClick={togglePlay}
//           className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600/80 rounded-full p-6 text-white"
//           aria-label="Play"
//         >
//           <Play size={32} fill="white" />
//         </button>
//       )}
//     </div>
//   );
// }
