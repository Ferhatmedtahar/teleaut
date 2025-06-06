"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getUserById } from "@/actions/profile/getUserById.action";
import {
  addComment,
  getVideoComments,
  togglePinComment,
} from "@/actions/videos/comments";
import { Button } from "@/components/common/buttons/Button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/providers/UserProvider";
import { Comment } from "@/types/Comment.interface";
import { useRouter } from "next/navigation";
import CommentItem from "./CommentItem";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function CommentSection({
  videoId,
}: {
  readonly videoId: string;
}) {
  const router = useRouter();
  const user = useUser();
  const [pinnedComments, setPinnedComments] = useState<Comment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      const { data } = await getVideoComments(videoId, 1);
      setPinnedComments(data.pinnedComments);
      setComments(data.comments);
      setHasMore(data.hasMore);
      setIsLoading(false);
    };

    const checkIfTeacher = async () => {
      const supabase = createClient();
      if (!user?.id) return;
      const { data } = await supabase
        .from("videos")
        .select("teacher_id")
        .eq("id", videoId)
        .single();
      if (data?.teacher_id === user.id) {
        setIsTeacher(true);
      }
    };

    fetchInitial();
    checkIfTeacher();
  }, [videoId]);

  const loadMoreComments = async () => {
    setIsLoading(true);
    const nextPage = page + 1;
    const { data } = await getVideoComments(videoId, nextPage);
    setComments((prev) => [...prev, ...data.comments]);
    setHasMore(data.hasMore);
    setPage(nextPage);
    setIsLoading(false);
  };

  const onSubmit = async (data: CommentFormValues) => {
    if (!user?.id) {
      toast.error("Vous devez être connecté pour commenter");
      return;
    }

    const { user: userData } = await getUserById(user.id);

    const tempId = "temp-" + Date.now();
    const optimisticComment: Comment = {
      id: tempId,
      content: data.content,
      created_at: new Date().toISOString(),
      is_pinned: false,
      user: {
        id: user.id,
        first_name: userData?.first_name ?? "User",
        profile_url: userData?.profile_url ?? null,
      },
    };

    setComments((prev) => [optimisticComment, ...prev]);
    reset();

    const formData = new FormData();
    formData.append("content", data.content);

    const result = await addComment(videoId, formData);

    if (!result.success || !result.comment) {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      toast.error("Impossible d'ajouter un commentaire", {
        description: result.message,
      });
      return;
    }

    setComments((prev) =>
      prev.map((comment) => (comment.id === tempId ? result.comment : comment))
    );
  };
  const handlePinComment = async (commentId: string) => {
    if (!isTeacher) return;

    const result = await togglePinComment(commentId, videoId);
    if (result.success) {
      const { data } = await getVideoComments(videoId, 1);
      setPinnedComments(data.pinnedComments);
      setComments(data.comments);
      setHasMore(data.hasMore);
      setPage(1);
    } else {
      toast.error("Impossible d'épingler/désépingler le commentaire", {
        description: result.message,
      });
    }
  };

  return (
    <div className="flex flex-col h-[500px] rounded-md overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-1 space-y-4">
        {pinnedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isTeacher={isTeacher}
            onPin={handlePinComment}
          />
        ))}
        {pinnedComments.length > 0 && comments.length > 0 && (
          <div className="h-px bg-gray-200 dark:bg-primary-700/40 w-full mt-4" />
        )}
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isTeacher={isTeacher}
            onPin={handlePinComment}
          />
        ))}
        {hasMore && (
          <div className="text-center">
            <Button variant="outline" onClick={loadMoreComments}>
              {isLoading ? "Loading..." : "Show More Comments"}
            </Button>
          </div>
        )}
        {!isLoading && comments.length === 0 && pinnedComments.length === 0 && (
          <p className="text-gray-500 text-center">Pas encore de questions.</p>
        )}
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-1 pt-2 border-t border-border/20"
      >
        <div className="flex-center gap-2">
          <Textarea
            placeholder="Ajouter une question..."
            className=" resize-none"
            {...register("content")}
          />
          <Button type="submit" disabled={isSubmitting}>
            <Send size={16} className="mr-1" />
            Post
          </Button>
        </div>
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </form>
    </div>
  );
}
