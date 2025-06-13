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
    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await uploadFile(thumbnailFile, "thumbnail", admin_id);
    }

    let documentsUrl = null;
    if (documentsFile) {
      documentsUrl = await uploadFile(documentsFile, "documents", admin_id);
    }

    const supabase = await createClient();

    // Insert data matching your actual database schema
    const featuredVideoData = {
      title,
      description: description || "",
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      documents_url: documentsUrl,
      teacher_id: admin_id,
      is_featured,
      status: 0, // Initial status - pending processing
      // Required fields with default values for admin videos
      class: "FEATURED", // or whatever makes sense for your admin videos
      subject: "GENERAL", // or whatever makes sense for your admin videos
      // Optional: set branch if needed
      // branch: ["ALL"], // or leave as null if not needed
      // created_at will be set automatically by the database default
    };

    // Insert into videos table
    const { data, error } = await supabase
      .from("videos")
      .insert(featuredVideoData)
      .select("id")
      .single();

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
// "use server";

// import { uploadFile } from "@/lib/helpers/uploadFile";
// import { createClient } from "@/lib/supabase/server";

// interface CreateFeaturedVideoRecordParams {
//   videoUrl: string;
//   thumbnailFile: File;
//   documentsFile: File | null;
//   title: string;
//   description: string;
//   admin_id: string;
//   is_featured: boolean;
// }

// export async function createFeaturedVideoRecord({
//   videoUrl,
//   thumbnailFile,
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

//     // Upload documents (optional)
//     let documentsUrl = null;
//     if (documentsFile) {
//       documentsUrl = await uploadFile(documentsFile, "documents", admin_id);
//     }

//     const supabase = await createClient();

//     // Option 1: Using existing videos table with new columns
//     const featuredVideoData = {
//       title,
//       description: description || "",
//       video_url: videoUrl,
//       thumbnail_url: thumbnailUrl,
//       documents_url: documentsUrl,
//       teacher_id: admin_id,
//       is_featured,
//       video_type: "featured",
//       status: 0,
//       created_at: new Date().toISOString(),

//       class: "N/A",
//       subject: "N/A",
//     };

//     // Insert into videos table
//     const { data, error } = await supabase
//       .from("videos")
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

// // "use server";

// // import { uploadFile } from "@/lib/helpers/uploadFile";
// // import { createClient } from "@/lib/supabase/server";

// // interface CreateFeaturedVideoRecordParams {
// //   videoUrl: string;
// //   thumbnailFile: File;
// //   notesFile: File | null;
// //   documentsFile: File | null;
// //   title: string;
// //   description: string;
// //   admin_id: string;
// //   is_featured: boolean;
// // }

// // export async function createFeaturedVideoRecord({
// //   videoUrl,
// //   thumbnailFile,
// //   notesFile,
// //   documentsFile,
// //   title,
// //   description,
// //   admin_id,
// //   is_featured,
// // }: CreateFeaturedVideoRecordParams): Promise<{
// //   success: boolean;
// //   message?: string;
// //   id?: string;
// // }> {
// //   try {
// //     // Upload thumbnail (required)
// //     let thumbnailUrl = null;
// //     if (thumbnailFile) {
// //       thumbnailUrl = await uploadFile(thumbnailFile, "thumbnail", admin_id);
// //     }

// //     // Upload notes (optional)
// //     let notesUrl = null;
// //     if (notesFile) {
// //       notesUrl = await uploadFile(notesFile, "notes", admin_id);
// //     }

// //     // Upload documents (optional)
// //     let documentsUrl = null;
// //     if (documentsFile) {
// //       documentsUrl = await uploadFile(documentsFile, "documents", admin_id);
// //     }

// //     // Prepare featured video data
// //     const featuredVideoData = {
// //       title,
// //       description: description || "",
// //       video_url: videoUrl,
// //       thumbnail_url: thumbnailUrl,
// //       notes_url: notesUrl,
// //       documents_url: documentsUrl,
// //       admin_id,
// //       is_featured,
// //       status: 0, // Initial status - pending processing
// //       created_at: new Date().toISOString(),
// //     };

// //     const supabase = await createClient();

// //     // Insert into featured_videos table (adjust table name as needed)
// //     const { data, error } = await supabase
// //       .from("featured_videos") // Assuming this is your table name
// //       .insert(featuredVideoData)
// //       .select("id")
// //       .single();

// //     if (error) {
// //       console.error("Error storing featured video in Supabase:", error);
// //       return {
// //         success: false,
// //         message: "Échec du stockage de la vidéo mise en avant",
// //       };
// //     }

// //     return {
// //       success: true,
// //       message: "Vidéo mise en avant créée avec succès",
// //       id: data.id,
// //     };
// //   } catch (error) {
// //     console.error("Error creating featured video record:", error);
// //     return {
// //       success: false,
// //       message: "Échec de la création de la vidéo mise en avant",
// //     };
// //   }
// // }
