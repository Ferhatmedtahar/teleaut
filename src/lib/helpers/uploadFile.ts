import { createClient } from "@/lib/supabase/server";

export async function uploadFile(
  file: File,
  fileType: string,
  userId: string
): Promise<string> {
  if (!file) throw new Error(`${fileType} file is required`);

  try {
    const supabase = await createClient();

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}.${fileExt}`;

    // Determine the folder path based on file type
    let folderPath = "";
    if (fileType === "profile_picture") {
      folderPath = "profiles/profile-pictures";
    } else if (fileType === "cover_picture") {
      folderPath = "profiles/cover-pictures";
    }

    const fullPath = `${folderPath}/${fileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("tele")
      .upload(fullPath, buffer, {
        contentType: file.type,
        upsert: false,
        cacheControl: "3600",
      });

    if (error) {
      console.error("Supabase upload error:", error);
      throw new Error(`Failed to upload ${fileType}: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("tele").getPublicUrl(data.path);

    const { error: dbError } = await supabase.from("user_files").insert({
      user_id: userId,
      file_type: fileType,
      file_url: publicUrl,
      file_path: data.path,
      mime_type: file.type,
      file_size: file.size,
    });

    if (dbError) {
      console.error("Error storing file record:", dbError);
      // Attempt to clean up the uploaded file if DB insert fails
      await supabase.storage.from("tele").remove([data.path]);
      throw new Error(`Failed to store file record: ${dbError.message}`);
    }

    return publicUrl;
  } catch (e) {
    console.error("Upload file error:", e);
    throw new Error(`Failed to upload ${fileType}`);
  }
}

/**
 * Delete a file from Supabase Storage
 * @param fileUrl - The public URL of the file to delete
 * @param userId - The user ID who owns the file
 * @param fileType - The type of file (profile_picture, cover_picture, etc.)
 */
export async function deleteFile(
  fileUrl: string,
  userId: string,
  fileType: string
): Promise<void> {
  if (!fileUrl) return;

  try {
    const supabase = await createClient();

    // Extract the file path from the URL
    const url = new URL(fileUrl);
    const pathMatch = url.pathname.match(
      /\/storage\/v1\/object\/public\/tele\/(.+)/
    );

    if (pathMatch && pathMatch[1]) {
      const filePath = pathMatch[1];

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("tele")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting file from storage:", storageError);
        throw new Error(
          `Failed to delete file from storage: ${storageError.message}`
        );
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("user_files")
        .delete()
        .eq("user_id", userId)
        .eq("file_type", fileType)
        .eq("file_path", filePath);

      if (dbError) {
        console.error("Error deleting file record from database:", dbError);
      }
    }
  } catch (e) {
    console.error("Error in deleteFile:", e);
    throw e;
  }
}
