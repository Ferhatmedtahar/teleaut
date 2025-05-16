"use client";

import {
  getUserLikeStatus,
  getVideoLikesCount,
  toggleVideoLike,
} from "@/actions/videos/likes";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Clock, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface VideoInfoProps {
  video: {
    readonly id: string;
    readonly title: string;
    readonly created_at: string;
    readonly views: number;
    readonly teacher: {
      id: string;
      first_name: string;
      last_name?: string;
      profile_url: string | null;
    };
  };
}

export default function VideoInfo({ video }: VideoInfoProps) {
  const [likesCount, setLikesCount] = useState({ likes: 0, dislikes: 0 });
  const [userLikeStatus, setUserLikeStatus] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLikesData = async () => {
      const [{ data: likesData }, { data: userStatus }] = await Promise.all([
        getVideoLikesCount(video.id),
        getUserLikeStatus(video.id),
      ]);

      setLikesCount(likesData);
      setUserLikeStatus(userStatus);
    };

    fetchLikesData();
  }, [video.id]);

  const handleLike = async (isLike: boolean) => {
    setIsLoading(true);

    // Optimistic UI update
    const prevUserLikeStatus = userLikeStatus;
    const prevLikesCount = { ...likesCount };

    // Update UI immediately
    if (userLikeStatus === isLike) {
      // User is unliking/undisliking
      setUserLikeStatus(null);
      if (isLike) {
        setLikesCount((prev) => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        setLikesCount((prev) => ({ ...prev, dislikes: prev.dislikes - 1 }));
      }
    } else if (userLikeStatus === null) {
      // User is liking/disliking for the first time
      setUserLikeStatus(isLike);
      if (isLike) {
        setLikesCount((prev) => ({ ...prev, likes: prev.likes + 1 }));
      } else {
        setLikesCount((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }));
      }
    } else {
      // User is changing from like to dislike or vice versa
      setUserLikeStatus(isLike);
      if (isLike) {
        setLikesCount((prev) => ({
          likes: prev.likes + 1,
          dislikes: prev.dislikes - 1,
        }));
      } else {
        setLikesCount((prev) => ({
          likes: prev.likes - 1,
          dislikes: prev.dislikes + 1,
        }));
      }
    }

    // Make the actual API call
    const result = await toggleVideoLike(video.id, isLike);

    if (!result.success) {
      // Revert to previous state if there was an error
      setUserLikeStatus(prevUserLikeStatus);
      setLikesCount(prevLikesCount);

      toast.error("Failed to like/dislike video", {
        description: result.message,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            {video.teacher.profile_url ? (
              <Image
                src={video.teacher.profile_url}
                alt={video.teacher.first_name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-medium">
                  {video.teacher.first_name.charAt(0)}
                </span>
              </div>
            )}
            <div className="ml-3">
              <p className="font-medium">
                {video.teacher.first_name} {video.teacher.last_name}
              </p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(video.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock size={18} />
            <span>{video.views} views</span>
          </div>

          <div className="flex items-center ml-4">
            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                userLikeStatus === true ? "text-blue-600" : ""
              }`}
              onClick={() => handleLike(true)}
              disabled={isLoading}
            >
              <ThumbsUp size={18} />
              <span>{likesCount.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1 ${
                userLikeStatus === false ? "text-red-600" : ""
              }`}
              onClick={() => handleLike(false)}
              disabled={isLoading}
            >
              <ThumbsDown size={18} />
              <span>{likesCount.dislikes}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-200 w-full my-4" />
    </div>
  );
}
