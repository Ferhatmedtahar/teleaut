"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { formatDistanceToNow } from "date-fns";
import { Pin, Send } from "lucide-react";
import Image from "next/image";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/providers/UserProvider";

const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long"),
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
    profile_url: string | null;
  };
}

export default function CommentSection({ videoId }: { videoId: string }) {
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
      toast.error("You must be logged in to comment");
      return;
    }

    const { user: userData } = await getUserById(user.id);
    const optimisticComment: Comment = {
      id: "temp-" + Date.now(),
      content: data.content,
      created_at: new Date().toISOString(),
      is_pinned: false,
      user: {
        id: user.id,
        name: userData?.name || "User",
        profile_url: userData?.profile_url || null,
      },
    };

    setComments((prev) => [optimisticComment, ...prev]);
    reset();
    const formData = new FormData();

    formData.append("content", data.content);
    const result = await addComment(videoId, formData);

    if (!result.success) {
      setComments((prev) =>
        prev.filter((comment) => comment.id !== optimisticComment.id)
      );
      toast.error("Failed to add comment", {
        description: result.message,
      });
    }
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
      toast.error("Failed to pin/unpin comment", {
        description: result.message,
      });
    }
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-md overflow-hidden">
      {/* Comments area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {pinnedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            isTeacher={isTeacher}
            onPin={handlePinComment}
          />
        ))}
        {pinnedComments.length > 0 && comments.length > 0 && (
          <div className="h-px bg-gray-200 my-4" />
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
          <p className="text-gray-500 text-center">No comments yet.</p>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            className="flex-1 resize-none"
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
      {comment.user.profile_url ? (
        <Image
          src={comment.user.profile_url}
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
        <div className="flex items-center gap-2 flex-wrap">
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

// "use client";

// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { formatDistanceToNow } from "date-fns";
// import { Pin, Send } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { getUserById } from "@/actions/profile/getUserById.action";
// import {
//   addComment,
//   getVideoComments,
//   togglePinComment,
// } from "@/actions/videos/comments";
// import { createClient } from "@/lib/supabase/client";
// import { useUser } from "@/providers/UserProvider";
// import { toast } from "sonner";

// const commentSchema = z.object({
//   content: z
//     .string()
//     .min(1, "Comment cannot be empty")
//     .max(2000, "Comment is too long"),
// });

// type CommentFormValues = z.infer<typeof commentSchema>;

// interface Comment {
//   id: string;
//   content: string;
//   created_at: string;
//   is_pinned: boolean;
//   user: {
//     id: string;
//     name: string;
//     profile_url: string | null;
//   };
// }

// export default function CommentSection({
//   videoId,
// }: {
//   readonly videoId: string;
// }) {
//   const user = useUser();
//   const [pinnedComments, setPinnedComments] = useState<Comment[]>([]);
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const [isTeacher, setIsTeacher] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm<CommentFormValues>({
//     resolver: zodResolver(commentSchema),
//   });

//   useEffect(() => {
//     const fetchComments = async () => {
//       setIsLoading(true);
//       const { data: result } = await getVideoComments(videoId, 1);
//       setPinnedComments(result.pinnedComments);
//       setComments(result.comments);
//       setHasMore(result.hasMore);
//       setIsLoading(false);
//     };

//     const checkIfTeacher = async () => {
//       const supabase = createClient();

//       if (user?.id) {
//         const { data } = await supabase
//           .from("videos")
//           .select("teacher_id")
//           .eq("id", videoId)
//           .single();

//         if (data && data.teacher_id === user?.id) {
//           setIsTeacher(true);
//         }
//       }
//     };

//     fetchComments();
//     checkIfTeacher();
//   }, [videoId]);

//   const loadMoreComments = async () => {
//     setIsLoading(true);
//     const nextPage = page + 1;
//     const { data: result } = await getVideoComments(videoId, nextPage);
//     setComments((prev) => [...prev, ...result.comments]);
//     setHasMore(result.hasMore);
//     setPage(nextPage);
//     setIsLoading(false);
//   };

//   const onSubmit = async (data: CommentFormValues) => {
//     const content = data.content;

//     if (!user?.id) {
//       toast.error("You must be logged in to comment", {
//         duration: 5000,
//         description: "Please log in to comment",
//       });

//       return;
//     }
//     if (!content || content.length == 0 || content.length > 2000) {
//       toast.error("Comment must be between 1 and 2000 characters", {
//         duration: 5000,
//         description: "Please input a valid comment",
//       });
//     }

//     const { user: userData } = await getUserById(user?.id);
//     const optimisticComment: Comment = {
//       id: "temp-" + Date.now(),
//       content: data.content,
//       created_at: new Date().toISOString(),
//       is_pinned: false,
//       user: {
//         id: user.id,
//         name: userData?.name || "User",
//         profile_url: userData?.profile_url || null,
//       },
//     };

//     // Add to the beginning of regular comments
//     setComments((prev) => [optimisticComment, ...prev]);

//     // Reset form
//     reset();

//     // Submit to server
//     const result = await addComment(videoId, new FormData());

//     if (!result.success) {
//       // Remove optimistic comment if there was an error
//       setComments((prev) =>
//         prev.filter((comment) => comment.id !== optimisticComment.id)
//       );

//       toast.error("Failed to add comment", {
//         description: result.message,
//       });
//     }
//   };

//   const handlePinComment = async (commentId: string) => {
//     if (!isTeacher) return;

//     const result = await togglePinComment(commentId, videoId);

//     if (result.success) {
//       // Refetch comments to get updated pinned status
//       const { data: commentsData } = await getVideoComments(videoId, 1);
//       setPinnedComments(commentsData.pinnedComments);
//       setComments(commentsData.comments);
//       setHasMore(commentsData.hasMore);
//       setPage(1);
//     } else {
//       toast.error("Failed to pin/unpin comment", {
//         description: result.message,
//       });
//     }
//   };

//   return (
//     <div className="mb-8">
//       {/* Comment form */}

//       {/* Pinned comments */}
//       {pinnedComments.length > 0 && (
//         <div className="mb-6">
//           <h3 className="text-lg font-medium mb-4">Pinned Comments</h3>
//           <div className="space-y-6">
//             {pinnedComments.map((comment) => (
//               <CommentItem
//                 key={comment.id}
//                 comment={comment}
//                 isTeacher={isTeacher}
//                 onPin={handlePinComment}
//               />
//             ))}
//           </div>
//           {pinnedComments.length > 0 && comments.length > 0 && (
//             <div className="h-px bg-gray-200 w-full my-6" />
//           )}
//         </div>
//       )}

//       {/* Regular comments */}
//       <div className="space-y-6">
//         {comments.map((comment) => (
//           <CommentItem
//             key={comment.id}
//             comment={comment}
//             isTeacher={isTeacher}
//             onPin={handlePinComment}
//           />
//         ))}
//       </div>

//       {/* Load more button */}
//       {hasMore && (
//         <div className="mt-6 text-center">
//           <Button
//             variant="outline"
//             onClick={loadMoreComments}
//             disabled={isLoading}
//           >
//             {isLoading ? "Loading..." : "Show More Comments"}
//           </Button>
//         </div>
//       )}

//       {comments.length === 0 && pinnedComments.length === 0 && !isLoading && (
//         <p className="text-gray-500 text-center py-8">
//           No comments yet. Be the first to comment!
//         </p>
//       )}

//       <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
//         <div className="flex gap-4">
//           <Textarea
//             placeholder="Add a comment..."
//             className="flex-1"
//             {...register("content")}
//           />
//           <Button type="submit" disabled={isSubmitting}>
//             <Send size={18} className="mr-2" />
//             Post
//           </Button>
//         </div>
//         {errors.content && (
//           <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
//         )}
//       </form>
//     </div>
//   );
// }

// function CommentItem({
//   comment,
//   isTeacher,
//   onPin,
// }: {
//   comment: Comment;
//   isTeacher: boolean;
//   onPin: (id: string) => void;
// }) {
//   return (
//     <div className="flex gap-4">
//       {comment.user.profile_url ? (
//         <Image
//           src={comment.user.profile_url}
//           alt={comment.user.name}
//           width={40}
//           height={40}
//           className="rounded-full object-cover"
//         />
//       ) : (
//         <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//           <span className="text-gray-500 font-medium">
//             {comment.user.name.charAt(0)}
//           </span>
//         </div>
//       )}

//       <div className="flex-1">
//         <div className="flex items-center gap-2">
//           <span className="font-medium">{comment.user.name}</span>
//           <span className="text-sm text-gray-500">
//             {formatDistanceToNow(new Date(comment.created_at), {
//               addSuffix: true,
//             })}
//           </span>

//           {comment.is_pinned && (
//             <span className="text-sm text-blue-600 flex items-center gap-1">
//               <Pin size={14} />
//               Pinned
//             </span>
//           )}
//         </div>

//         <p className="mt-1 text-gray-700">{comment.content}</p>

//         {isTeacher && (
//           <Button
//             variant="ghost"
//             size="sm"
//             className="mt-2 text-xs"
//             onClick={() => onPin(comment.id)}
//           >
//             <Pin size={14} className="mr-1" />
//             {comment.is_pinned ? "Unpin" : "Pin"}
//           </Button>
//         )}
//       </div>
//     </div>
//   );
// }
