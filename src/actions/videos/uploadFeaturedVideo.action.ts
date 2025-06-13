"use server";

import { uploadFile } from "@/lib/helpers/uploadFile";
import { createClient } from "@/lib/supabase/server";

interface CreateFeaturedVideoRecordParams {
  videoUrl: string;
  thumbnailFile: File;
  documentsFile: File | null;
  title: string;
  description: string;
  admin_id: string;
  is_featured: boolean;
}

export async function createFeaturedVideoRecord({
  videoUrl,
  thumbnailFile,
  documentsFile,
  title,
  description,
  admin_id,
  is_featured,
}: CreateFeaturedVideoRecordParams): Promise<{
  success: boolean;
  message?: string;
  id?: string;
}> {
  try {
    // Upload thumbnail (required)
    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await uploadFile(thumbnailFile, "thumbnail", admin_id);
    }

    // Upload documents (optional)
    let documentsUrl = null;
    if (documentsFile) {
      documentsUrl = await uploadFile(documentsFile, "documents", admin_id);
    }

    const supabase = await createClient();

    // Option 1: Using existing videos table with new columns
    const featuredVideoData = {
      title,
      description: description || "",
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      documents_url: documentsUrl,
      admin_id,
      is_featured, // For existing table approach
      video_type: "featured",
      status: 0, // Initial status - pending processing
      created_at: new Date().toISOString(),
      // Set required fields for videos table
      class: "N/A", // Not applicable for featured videos
      subject: "N/A", // Not applicable for featured videos
    };

    // Insert into videos table
    const { data, error } = await supabase
      .from("videos")
      .insert(featuredVideoData)
      .select("id")
      .single();

    // Alternative: If using separate featured_videos table
    /*
    const featuredVideoData = {
      title,
      description: description || "",
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      documents_url: documentsUrl,
      admin_id,
      is_active,
      status: 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("featured_videos")
      .insert(featuredVideoData)
      .select("id")
      .single();
    */

    if (error) {
      console.error("Error storing featured video in Supabase:", error);
      return {
        success: false,
        message: "Échec du stockage de la vidéo mise en avant",
      };
    }

    return {
      success: true,
      message: "Vidéo mise en avant créée avec succès",
      id: data.id,
    };
  } catch (error) {
    console.error("Error creating featured video record:", error);
    return {
      success: false,
      message: "Échec de la création de la vidéo mise en avant",
    };
  }
}

// Helper function to get the current active featured video
export async function getActiveFeaturedVideo() {
  const supabase = await createClient();

  // Option 1: From videos table
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .eq("is_featured", true)
    .eq("video_type", "featured")
    .single();

  // Alternative: From separate featured_videos table
  /*
  const { data, error } = await supabase
    .from("featured_videos")
    .select("*")
    .eq("is_active", true)
    .single();
  */

  if (error) {
    console.error("Error fetching active featured video:", error);
    return null;
  }

  return data;
}

// Helper function to deactivate all featured videos
export async function deactivateAllFeaturedVideos() {
  const supabase = await createClient();

  // Option 1: Update videos table
  const { error } = await supabase
    .from("videos")
    .update({ is_featured: false })
    .eq("video_type", "featured");

  // Alternative: Update featured_videos table
  /*
  const { error } = await supabase
    .from("featured_videos")
    .update({ is_active: false })
    .eq("is_active", true);
  */

  if (error) {
    console.error("Error deactivating featured videos:", error);
    return false;
  }

  return true;
}
// "use server";

// import { uploadFile } from "@/lib/helpers/uploadFile";
// import { createClient } from "@/lib/supabase/server";

// interface CreateFeaturedVideoRecordParams {
//   videoUrl: string;
//   thumbnailFile: File;
//   notesFile: File | null;
//   documentsFile: File | null;
//   title: string;
//   description: string;
//   admin_id: string;
//   is_featured: boolean;
// }

// export async function createFeaturedVideoRecord({
//   videoUrl,
//   thumbnailFile,
//   notesFile,
//   documentsFile,
//   title,
//   description,
//   admin_id,
//   is_featured,
// }: CreateFeaturedVideoRecordParams): Promise<{
//   success: boolean;
//   message?: string;
//   id?: string;
// }> {
//   try {
//     // Upload thumbnail (required)
//     let thumbnailUrl = null;
//     if (thumbnailFile) {
//       thumbnailUrl = await uploadFile(thumbnailFile, "thumbnail", admin_id);
//     }

//     // Upload notes (optional)
//     let notesUrl = null;
//     if (notesFile) {
//       notesUrl = await uploadFile(notesFile, "notes", admin_id);
//     }

//     // Upload documents (optional)
//     let documentsUrl = null;
//     if (documentsFile) {
//       documentsUrl = await uploadFile(documentsFile, "documents", admin_id);
//     }

//     // Prepare featured video data
//     const featuredVideoData = {
//       title,
//       description: description || "",
//       video_url: videoUrl,
//       thumbnail_url: thumbnailUrl,
//       notes_url: notesUrl,
//       documents_url: documentsUrl,
//       admin_id,
//       is_featured,
//       status: 0, // Initial status - pending processing
//       created_at: new Date().toISOString(),
//     };

//     const supabase = await createClient();

//     // Insert into featured_videos table (adjust table name as needed)
//     const { data, error } = await supabase
//       .from("featured_videos") // Assuming this is your table name
//       .insert(featuredVideoData)
//       .select("id")
//       .single();

//     if (error) {
//       console.error("Error storing featured video in Supabase:", error);
//       return {
//         success: false,
//         message: "Échec du stockage de la vidéo mise en avant",
//       };
//     }

//     return {
//       success: true,
//       message: "Vidéo mise en avant créée avec succès",
//       id: data.id,
//     };
//   } catch (error) {
//     console.error("Error creating featured video record:", error);
//     return {
//       success: false,
//       message: "Échec de la création de la vidéo mise en avant",
//     };
//   }
// }
