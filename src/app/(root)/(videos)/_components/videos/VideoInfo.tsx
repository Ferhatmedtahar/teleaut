"use client";

import {
  getUserLikeStatus,
  getVideoLikesCount,
  toggleVideoLike,
} from "@/actions/videos/likes";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaClockRotateLeft } from "react-icons/fa6";
import { toast } from "sonner";
import ShareLink from "./ShareLink";
interface VideoInfoProps {
  readonly video: {
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
  const { theme } = useTheme();
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

    const prevUserLikeStatus = userLikeStatus;
    const prevLikesCount = { ...likesCount };

    if (userLikeStatus === isLike) {
      setUserLikeStatus(null);
      if (isLike) {
        setLikesCount((prev) => ({ ...prev, likes: prev.likes - 1 }));
      } else {
        setLikesCount((prev) => ({ ...prev, dislikes: prev.dislikes - 1 }));
      }
    } else if (userLikeStatus === null) {
      setUserLikeStatus(isLike);
      if (isLike) {
        setLikesCount((prev) => ({ ...prev, likes: prev.likes + 1 }));
      } else {
        setLikesCount((prev) => ({ ...prev, dislikes: prev.dislikes + 1 }));
      }
    } else {
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

    const result = await toggleVideoLike(video.id, isLike);
    if (!result.success) {
      setUserLikeStatus(prevUserLikeStatus);
      setLikesCount(prevLikesCount);

      toast.error("Failed to like/dislike video", {
        description: result.message,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-2">{video.title}</h1>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center flex-col gap-4">
          <div className="flex items-center gap-6 text-gray-500">
            <div className="flex items-center gap-1">
              {theme === "dark" ? (
                <Image
                  src="/icons/views-dark.svg"
                  alt="Views"
                  width={19}
                  height={19}
                />
              ) : (
                <Image
                  src="/icons/views.svg"
                  alt="Views"
                  width={19}
                  height={19}
                />
              )}

              <span className="text-sm">{video.views} views</span>
            </div>

            <div className="flex gap-2 items-center">
              {theme === "dark" ? (
                <FaClockRotateLeft size={18} className="text-white/85 " />
              ) : (
                <Image
                  src="/icons/Clock.svg"
                  alt="Time"
                  width={19}
                  height={19}
                />
              )}

              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(video.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <Link
              target="_blank"
              href={`/profile/${video.teacher.id}`}
              className="shrink-0 w-12 h-12"
            >
              {video.teacher.profile_url ? (
                <Image
                  src={video.teacher.profile_url}
                  alt={video.teacher.first_name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {video.teacher.first_name.charAt(0) +
                      video.teacher.last_name?.charAt(0)}
                  </span>
                </div>
              )}
            </Link>

            <div className="ml-3">
              <p className="font-medium">
                {video.teacher.first_name} {video.teacher.last_name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 ">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={`flex items-center gap-1  ${
                userLikeStatus === true ? "text-blue-600" : ""
              }`}
              onClick={() => handleLike(true)}
              disabled={isLoading}
            >
              <ThumbsUp size={19} />
              <span>{likesCount.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={`flex items-center gap-1 ${
                userLikeStatus === false ? "text-red-600" : ""
              }`}
              onClick={() => handleLike(false)}
              disabled={isLoading}
            >
              <ThumbsDown size={19} />
              <span>{likesCount.dislikes}</span>
            </Button>
          </div>
          <ShareLink isLoading={isLoading} />
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
    </div>
  );
}
