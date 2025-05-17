"use client";

import { formatDistanceToNow } from "date-fns";
import { Pin } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/common/buttons/Button";
import { Comment } from "@/types/Comment.interface";
import Link from "next/link";

export default function CommentItem({
  comment,
  isTeacher,
  onPin,
}: {
  readonly comment: Comment;
  readonly isTeacher: boolean;
  readonly onPin: (id: string) => void;
}) {
  console.table(comment);
  return (
    <div className="flex gap-4 p-2 border  border-border/20 rounded-xl">
      <Link
        target="_blank"
        href={`/profile/${comment.user.id}`}
        className="shrink-0 w-12 h-12"
      >
        {comment.user.profile_url ? (
          <Image
            src={comment.user.profile_url}
            alt={comment.user.first_name}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 font-medium">
              {comment.user.first_name.charAt(0) +
                comment.user.last_name?.charAt(0)}
            </span>
          </div>
        )}
      </Link>
      <div className="flex-1 max-w-full">
        <div className="flex items-end gap-2 flex-wrap">
          <span className="font-medium capitalize">
            {comment.user.first_name}
          </span>
          <span className="text-[10px] text-gray-500">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </span>
          {comment.is_pinned && (
            <span className="text-sm text-primary-800 flex items-center gap-1">
              <Pin size={14} />
              Pinned
            </span>
          )}
        </div>
        <p className="mt-1 text-gray-700 text-sm whitespace-pre-line break-words max-w-[calc(100%-5rem)]">
          {comment.content}
        </p>

        {isTeacher && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-1 text-xs"
            onClick={() => onPin(comment.id)}
          >
            <Pin size={14} className="mr-1" />
            {comment.is_pinned ? "Unpin" : "Pin"}
          </Button>
        )}
      </div>
    </div>
  );
}
