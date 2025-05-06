import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

/**
 * Upload a file to BunnyCDN with client-side code
 */
export async function uploadFile(
  file: File,
  fileType: string,
  userId?: string
): Promise<{ url: string; path: string }> {
  if (!file) throw new Error("No file provided");

  // Create form data
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  if (userId) formData.append("userId", userId);

  // Send to our API route
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Upload failed");
  }

  const data = await response.json();
  return { url: data.url, path: data.path };
}

/**
 * Get files associated with a user
 */
export async function getUserFiles(userId: string, fileType?: string) {
  let query = supabase.from("user_files").select("*").eq("user_id", userId);

  if (fileType) {
    query = query.eq("file_type", fileType);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch user files:", error);
    throw new Error("Failed to fetch user files");
  }

  return data;
}

/**
 * Delete a file from BunnyCDN and database
 */
export async function deleteFile(fileId: string, userId: string) {
  // First get the file path from database
  const { data, error } = await supabase
    .from("user_files")
    .select("file_url, file_path")
    .eq("id", fileId)
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    throw new Error("File not found or you don't have permission to delete it");
  }

  // Call API to delete the file from BunnyCDN
  const deleteResponse = await fetch(
    `/api/upload?path=${encodeURIComponent(data.file_path)}`,
    {
      method: "DELETE",
    }
  );

  if (!deleteResponse.ok) {
    const errorData = await deleteResponse.json();
    throw new Error(errorData.error ?? "Failed to delete file from storage");
  }

  // Delete the record from database
  const { error: deleteError } = await supabase
    .from("user_files")
    .delete()
    .eq("id", fileId)
    .eq("user_id", userId);

  if (deleteError) {
    throw new Error("Failed to delete file record from database");
  }

  return { success: true };
}

/**
 * Update file metadata
 */
export async function updateFileMetadata(
  fileId: string,
  userId: string,
  metadata: { title?: string; description?: string }
) {
  const { error } = await supabase
    .from("user_files")
    .update(metadata)
    .eq("id", fileId)
    .eq("user_id", userId);

  if (error) {
    throw new Error("Failed to update file metadata");
  }

  return { success: true };
}

// Types for file management
export interface FileRecord {
  id: string;
  user_id: string;
  file_type: string;
  file_url: string;
  file_path: string;
  title?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Video specific functions
export async function getVideoDetails(videoId: string) {
  const response = await fetch(`/api/videos/${videoId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get video details");
  }

  return await response.json();
}

export async function getVideoStatistics(
  videoId: string,
  dateRange?: { start: Date; end: Date }
) {
  let url = `/api/videos/${videoId}/statistics`;

  if (dateRange) {
    const startStr = dateRange.start.toISOString();
    const endStr = dateRange.end.toISOString();
    url += `?start=${encodeURIComponent(startStr)}&end=${encodeURIComponent(
      endStr
    )}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to get video statistics");
  }

  return await response.json();
}
