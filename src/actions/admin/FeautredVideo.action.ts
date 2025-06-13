"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Get the currently active featured video
export async function getActiveFeaturedVideo() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("is_featured", true)
    .eq("class", "FEATURED")
    .eq("subject", "GENERAL")
    .single();

  if (error) {
    console.error("Error fetching active featured video:", error);
    return null;
  }

  return data;
}

// Helper function to deactivate all featured videos
export async function deactivateAllFeaturedVideos() {
  const supabase = await createClient();

  const { error } = await supabase
    .from("videos")
    .update({ is_featured: false })
    .eq("class", "FEATURED")
    .eq("subject", "GENERAL");

  if (error) {
    console.error("Error deactivating featured videos:", error);
    return false;
  }

  return true;
}

// Toggle featured status for a specific video
export async function toggleFeaturedVideo(
  videoId: string,
  setAsFeatured: boolean
) {
  const supabase = await createClient();

  try {
    // First, verify the video exists and is eligible
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("id, title, class, subject, is_featured")
      .eq("id", videoId)
      .eq("class", "FEATURED")
      .eq("subject", "GENERAL")
      .single();

    if (fetchError || !video) {
      return {
        success: false,
        message: "Video not found or not eligible for featured status",
      };
    }

    // If setting as featured, first deactivate all other featured videos
    if (setAsFeatured) {
      const deactivateSuccess = await deactivateAllFeaturedVideos();
      if (!deactivateSuccess) {
        return {
          success: false,
          message: "Failed to deactivate other featured videos",
        };
      }
    }

    // Update the target video's featured status
    const { data, error: updateError } = await supabase
      .from("videos")
      .update({ is_featured: setAsFeatured })
      .eq("id", videoId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating video featured status:", updateError);
      return {
        success: false,
        message: "Failed to update video featured status",
      };
    }

    // Revalidate the page to reflect changes
    revalidatePath("/admin/videos");

    return {
      success: true,
      message: setAsFeatured
        ? `"${video.title}" marked as featured successfully`
        : `Featured status removed from "${video.title}" successfully`,
      data,
    };
  } catch (error) {
    console.error("Error in toggleFeaturedVideo:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

// Delete video server action (enhanced)
export async function deleteVideo(videoId: string) {
  const supabase = await createClient();

  try {
    // First get the video info for the response message
    const { data: video, error: fetchError } = await supabase
      .from("videos")
      .select("title")
      .eq("id", videoId)
      .single();

    if (fetchError) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    // Delete the video
    const { error: deleteError } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId);

    if (deleteError) {
      console.error("Error deleting video:", deleteError);
      return {
        success: false,
        message: "Failed to delete video",
      };
    }

    // Revalidate the page to reflect changes
    revalidatePath("/admin/videos");

    return {
      success: true,
      message: `"${video.title}" deleted successfully`,
    };
  } catch (error) {
    console.error("Error in deleteVideo:", error);
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

// Get all videos with enhanced filtering
export async function getVideos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  return data;
}

// Get only featured eligible videos
export async function getFeaturedEligibleVideos() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("class", "FEATURED")
    .eq("subject", "GENERAL")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured eligible videos:", error);
    return [];
  }

  return data;
}
