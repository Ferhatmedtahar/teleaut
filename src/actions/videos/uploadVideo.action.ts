"use server";

import { uploadFile } from "@/lib/helpers/uploadFile";
import { uploadVideoUtil } from "@/lib/helpers/uploadVideo";
import { createClient } from "@/lib/supabase/server";

type VideoUploadParams = {
  videoFile: File;
  thumbnailFile: File | null;
  notesFile: File | null;
  documentsFile: File | null;
  title: string;
  subject: string;
  classValue: string;
  description: string;
  teacher_id: string;
  branch: string[] | undefined | null;
};

export async function uploadVideo({
  videoFile,
  thumbnailFile,
  title,
  subject,
  classValue,
  description,
  notesFile,
  documentsFile,
  teacher_id,
  branch,
}: VideoUploadParams): Promise<{
  success: boolean;
  message?: string;
  id?: string;
}> {
  try {
    // Upload video file to Bunny CDN
    // const videoUrl = await uploadFile(videoFile, "video", teacher_id);
    const videoUrl = await uploadVideoUtil(videoFile, teacher_id);

    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await uploadFile(thumbnailFile, "thumbnail", teacher_id);
    }
    let notesUrl = null;
    if (notesFile) {
      notesUrl = await uploadFile(notesFile, "notes", teacher_id);
    }
    let documentsUrl = null;
    if (documentsFile) {
      documentsUrl = await uploadFile(documentsFile, "documents", teacher_id);
    }

    const videoData = {
      title,
      subject,
      class: classValue,
      description,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      notes_url: notesUrl,
      documents_url: documentsUrl,
      teacher_id,
      branch,
      created_at: new Date().toISOString(),
    };

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("videos")
      .insert(videoData)
      .select("id")
      .single();

    if (error) {
      console.error("Error storing video in Supabase:", error);
      return { success: false, message: "Failed to store video in Supabase" };
    }

    return {
      success: true,
      message: "Video uploaded successfully",
      id: data.id,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    return { success: false, message: "Failed to upload video" };
  }
}
