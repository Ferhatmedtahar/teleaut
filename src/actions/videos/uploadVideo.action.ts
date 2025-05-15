"use server";

import { uploadFile } from "@/app/(auth)/_lib/uploadFile";
import { revalidatePath } from "next/cache";

type VideoUploadParams = {
  videoFile: File;
  thumbnailFile: File | null;
  title: string;
  subject: string;
  classValue: string;
  description: string;
  userId: string;
};

export async function uploadVideo({
  videoFile,
  thumbnailFile,
  title,
  subject,
  classValue,
  description,
  userId,
}: VideoUploadParams) {
  try {
    // Upload video file to Bunny CDN
    const videoUrl = await uploadFile(videoFile, "video", userId);

    // Upload thumbnail if provided
    let thumbnailUrl = null;
    if (thumbnailFile) {
      thumbnailUrl = await uploadFile(thumbnailFile, "thumbnail", userId);
    }

    // Store video metadata in your database (e.g., Supabase)
    // This would depend on your database structure
    const videoData = {
      title,
      subject,
      class: classValue,
      description,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    // Example: Store in Supabase
    // const supabase = await createClient();
    // const { data, error } = await supabase.from("videos").insert(videoData);
    // if (error) throw new Error(error.message);

    // For now, just return the data
    revalidatePath("/videos");
    return {
      success: true,
      message: "Video uploaded successfully",
      data: videoData,
    };
  } catch (error) {
    console.error("Error uploading video:", error);
    return { success: false, message: "Failed to upload video" };
  }
}
