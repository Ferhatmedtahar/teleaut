"use server";

import { uploadFile } from "@/lib/helpers/uploadFile";
import { createClient } from "@/lib/supabase/server";

type VideoRecordParams = {
  videoUrl: string;
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

export async function createVideoRecord({
  videoUrl,
  thumbnailFile,
  title,
  subject,
  classValue,
  description,
  notesFile,
  documentsFile,
  teacher_id,
  branch,
}: VideoRecordParams): Promise<{
  success: boolean;
  message?: string;
  id?: string;
}> {
  try {
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
      return { success: false, message: "Échec du stockage de la vidéo" };
    }

    return {
      success: true,
      message: "Vidéo créée avec succès",
      id: data.id,
    };
  } catch (error) {
    console.error("Error creating video record:", error);
    return { success: false, message: "Échec de la création de la vidéo" };
  }
}
