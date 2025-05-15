"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Pin, Send } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  addComment,
  getVideoComments,
  togglePinComment,
} from "@/actions/videos/comments";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(1000, "Comment is too long"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface Comment {
  id: string;
  content: string;
  created_at: string;
  is_pinned: boolean;
  user: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export default function CommentSection({ videoId }: { videoId: string }) {
  const [pinnedComments, setPinnedComments] = useState<Comment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const { data: result } = await getVideoComments(videoId, 1);
      setPinnedComments(result.pinnedComments);
      setComments(result.comments);
      setHasMore(result.hasMore);
      setIsLoading(false);
    };

    const checkIfTeacher = async () => {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();

      if (session.session?.user) {
        const { data } = await supabase
          .from("videos")
          .select("teacher_id")
          .eq("id", videoId)
          .single();

        if (data && data.teacher_id === session.session.user.id) {
          setIsTeacher(true);
        }
      }
    };

    fetchComments();
    checkIfTeacher();
  }, [videoId]);

  const loadMoreComments = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const { data: result } = await getVideoComments(videoId, nextPage);
    setComments((prev) => [...prev, ...result.comments]);
    setHasMore(result.hasMore);
    setPage(nextPage);
    setIsLoading(false);
  };

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true);

    // Optimistic UI update
    const supabase = createClient();
    const { data: session } = await supabase.auth.getSession();

    if (!session.session?.user) {
      toast.error("You must be logged in to comment", {
        duration: 5000,
        description: "Please log in to comment",
      });
      setIsSubmitting(false);
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("name, avatar_url")
      .eq("id", session.session.user.id)
      .single();

    const optimisticComment: Comment = {
      id: "temp-" + Date.now(),
      content: data.content,
      created_at: new Date().toISOString(),
      is_pinned: false,
      user: {
        id: session.session.user.id,
        name: userData?.name || "User",
        avatar_url: userData?.avatar_url,
      },
    };

    // Add to the beginning of regular comments
    setComments((prev) => [optimisticComment, ...prev]);

    // Reset form
    reset();

    // Submit to server
    const result = await addComment(
      videoId,
      new FormData(document.querySelector("form") as HTMLFormElement)
    );

    if (!result.success) {
      // Remove optimistic comment if there was an error
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticComment.id)
      );

      toast.error("Failed to add comment", {
        description: result.message,
      });
    }

    setIsSubmitting(false);
  };

  const handlePinComment = async (commentId: string) => {
    if (!isTeacher) return;

    const result = await togglePinComment(commentId, videoId);

    if (result.success) {
      // Refetch comments to get updated pinned status
      const { data: commentsData } = await getVideoComments(videoId, 1);
      setPinnedComments(commentsData.pinnedComments);
      setComments(commentsData.comments);
      setHasMore(commentsData.hasMore);
      setPage(1);
    } else {
      toast.error("Failed to pin/unpin comment", {
        description: result.message,
      });
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-6">Comments</h2>

      {/* Comment form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
        <div className="flex gap-4">
          <Textarea
            placeholder="Add a comment..."
            className="flex-1"
            {...register("content")}
          />
          <Button type="submit" disabled={isSubmitting}>
            <Send size={18} className="mr-2" />
            Post
          </Button>
        </div>
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </form>

      {/* Pinned comments */}
      {pinnedComments.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">Pinned Comments</h3>
          <div className="space-y-6">
            {pinnedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                isTeacher={isTeacher}
                onPin={handlePinComment}
              />
            ))}
          </div>
          {pinnedComments.length > 0 && comments.length > 0 && (
            <div className="h-px bg-gray-200 w-full my-6" />
          )}
        </div>
      )}

      {/* Regular comments */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isTeacher={isTeacher}
            onPin={handlePinComment}
          />
        ))}
      </div>

      {/* Load more button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={loadMoreComments}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Show More Comments"}
          </Button>
        </div>
      )}

      {comments.length === 0 && pinnedComments.length === 0 && !isLoading && (
        <p className="text-gray-500 text-center py-8">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  isTeacher,
  onPin,
}: {
  comment: Comment;
  isTeacher: boolean;
  onPin: (id: string) => void;
}) {
  return (
    <div className="flex gap-4">
      {comment.user.avatar_url ? (
        <Image
          src={comment.user.avatar_url || "/placeholder.svg"}
          alt={comment.user.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500 font-medium">
            {comment.user.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.user.name}</span>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(comment.created_at), {
              addSuffix: true,
            })}
          </span>

          {comment.is_pinned && (
            <span className="text-sm text-blue-600 flex items-center gap-1">
              <Pin size={14} />
              Pinned
            </span>
          )}
        </div>

        <p className="mt-1 text-gray-700">{comment.content}</p>

        {isTeacher && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 text-xs"
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
