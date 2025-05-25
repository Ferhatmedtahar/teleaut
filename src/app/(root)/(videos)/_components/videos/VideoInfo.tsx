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
    readonly class: string;
    readonly branch: string[];
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
    <div className="space-y-4">
      {/* Title and Class Level */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight flex-1">
          {video.title}
        </h1>
        <div className="flex-shrink-0">
          <span className="inline-block px-3 py-1 bg-primary-100/90 text-primary-900 rounded-full dark:bg-primary-900/30 dark:text-primary-100 text-sm font-medium">
            Niveau : {video.class}
          </span>
        </div>
      </div>

      {/* Branches */}
      {video.branch && video.branch.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Pour les élèves des branches suivantes :
          </p>
          <div className="flex flex-wrap gap-2">
            {video.branch.map((branch, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-md text-xs"
              >
                {branch}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Views and Time */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <Image
              src="/icons/views-dark.svg"
              alt="Views"
              width={16}
              height={16}
            />
          ) : (
            <Image src="/icons/views.svg" alt="Views" width={16} height={16} />
          )}
          <span>{video.views} views</span>
        </div>

        <div className="flex items-center gap-2">
          {theme === "dark" ? (
            <FaClockRotateLeft size={16} className="text-muted-foreground" />
          ) : (
            <Image src="/icons/Clock.svg" alt="Time" width={16} height={16} />
          )}
          <span>
            {formatDistanceToNow(new Date(video.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Teacher Info and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Teacher Info */}
        <Link
          href={`/profile/${video.teacher.id}`}
          target="_blank"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {video.teacher.profile_url ? (
            <Image
              src={video.teacher.profile_url}
              alt={video.teacher.first_name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground font-medium text-sm">
                {video.teacher.first_name.charAt(0)}
                {video.teacher.last_name?.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <p className="font-medium text-sm">
              {video.teacher.first_name} {video.teacher.last_name}
            </p>
          </div>
        </Link>

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

          {/* Like/Dislike and Share Actions */}

          <ShareLink isLoading={isLoading} />
        </div>
      </div>

      <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
    </div>
  );
}
