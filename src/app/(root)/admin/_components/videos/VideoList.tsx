"use client";

import { Button } from "@/components/common/buttons/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/helpers/formatDate";
import { Trash2, Video, Star, StarOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  deleteVideo,
  toggleFeaturedVideo,
} from "@/actions/admin/FeautredVideo.action";

interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  class: string;
  subject: string;
  created_at: string;
  is_featured: boolean;
}

interface VideosListProps {
  readonly videos: Video[];
}

export default function VideosList({ videos }: VideosListProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingFeatured, setIsTogglingFeatured] = useState<string | null>(
    null
  );

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteVideo(id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onToggleFeatured = async (
    id: string,
    currentFeaturedStatus: boolean
  ) => {
    try {
      setIsTogglingFeatured(id);
      const result = await toggleFeaturedVideo(id, !currentFeaturedStatus);
      if (result.success) {
        toast.success(result.message);
        // The server action handles revalidation, so no manual refresh needed
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error toggling featured status:", error);
      toast.error("Failed to update featured status");
    } finally {
      setIsTogglingFeatured(null);
    }
  };

  const canBeFeatured = (video: Video) => {
    return video.class === "FEATURED" && video.subject === "GENERAL";
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Videos List</h2>
      <div className="rounded-md border border-border/50 dark:border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">{video.title}</TableCell>
                <TableCell>{video.subject}</TableCell>
                <TableCell>{video.class}</TableCell>
                <TableCell>
                  {canBeFeatured(video) && (
                    <div className="flex items-center">
                      {video.is_featured ? (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="ml-2 text-sm">
                        {video.is_featured ? "Yes" : "No"}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>{formatDate(video.created_at)}</TableCell>
                <TableCell className="flex items-center justify-center">
                  <Link
                    href={`/videos/${video.id}`}
                    className="mt-2 mr-8 dark:text-primary-100 text-primary-900"
                    target="_blank"
                  >
                    <Video className="h-4 w-4" />
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {/* Featured Toggle Button - Only for FEATURED/GENERAL videos */}
                    {canBeFeatured(video) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`${
                              video.is_featured
                                ? "text-yellow-500 hover:text-yellow-600"
                                : "text-gray-400 hover:text-yellow-500"
                            }`}
                            disabled={isTogglingFeatured === video.id}
                            title={
                              video.is_featured
                                ? "Remove from featured"
                                : "Mark as featured"
                            }
                          >
                            {video.is_featured ? (
                              <Star className="h-4 w-4 fill-current" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {video.is_featured
                                ? "Remove Featured Status"
                                : "Mark as Featured"}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {video.is_featured
                                ? "Are you sure you want to remove this video from featured?"
                                : "Are you sure you want to mark this video as featured? This will remove featured status from any other currently featured video."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              disabled={isTogglingFeatured === video.id}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className={`${
                                video.is_featured
                                  ? "bg-gray-500 hover:bg-gray-600"
                                  : "bg-yellow-500 hover:bg-yellow-600"
                              }`}
                              onClick={() =>
                                onToggleFeatured(video.id, video.is_featured)
                              }
                              disabled={isTogglingFeatured === video.id}
                            >
                              {isTogglingFeatured === video.id
                                ? "Updating..."
                                : video.is_featured
                                ? "Remove Featured"
                                : "Mark as Featured"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {/* Delete Button */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Video</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this video? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => onDelete(video.id)}
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
