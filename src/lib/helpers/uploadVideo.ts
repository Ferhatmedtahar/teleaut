// export async function uploadVideoUtil(
//   file: File,
//   userId: string
// ): Promise<string> {
//   if (!file) throw new Error("Video file is required");

//   const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("userId", userId);
//   try {
//     const response = await fetch(`${BASE_URL}/api/video/upload`, {
//       method: "POST",
//       body: formData,
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       console.error("error", error);
//       throw new Error(error.message ?? "Échec du téléchargement de la vidéo");
//     }

//     const result = await response.json();
//     return result.videoUrl;
//   } catch (error) {
//     console.error("error", error);
//     throw new Error("Échec du téléchargement de la vidéo");
//   }
// }
export async function uploadVideoDirectly(
  file: File,
  userId: string
): Promise<string> {
  if (!file) throw new Error("Video file is required");

  // Validate file type
  if (!file.type.startsWith("video/")) {
    throw new Error("Please select a valid video file");
  }

  // Optional: Client-side size validation (adjust as needed)
  const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
  if (file.size > maxSize) {
    throw new Error("File is too large. Maximum size is 2GB.");
  }

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    console.log(
      `Starting upload for file: ${file.name}, size: ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    // Step 1: Get presigned upload URL from your API
    const presignResponse = await fetch(`${BASE_URL}/api/video/presign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        userId,
      }),
    });

    if (!presignResponse.ok) {
      const error = await presignResponse.json();
      throw new Error(error.message ?? "Failed to create upload URL");
    }

    const { uploadUrl, embedUrl, accessKey } = await presignResponse.json();

    console.log(
      "Got presigned URL, starting direct upload to Bunny...",
      uploadUrl
    );

    // Step 2: Upload directly to Bunny Stream
    await uploadToBunnyDirect(file, uploadUrl, accessKey);

    console.log("Upload completed successfully!");
    return embedUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Échec du téléchargement de la vidéo"
    );
  }
}

async function uploadToBunnyDirect(
  file: File,
  uploadUrl: string,
  accessKey: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        console.log("Direct upload to Bunny completed successfully");
        resolve();
      } else {
        console.error(
          `Upload failed with status ${xhr.status}: ${xhr.responseText}`
        );
        reject(
          new Error(
            `Upload failed with status ${xhr.status}: ${xhr.responseText}`
          )
        );
      }
    });

    xhr.addEventListener("error", (event) => {
      console.error("Network error during upload:", event);
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("timeout", () => {
      console.error("Upload timeout");
      reject(new Error("Upload timeout"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("AccessKey", accessKey);
    xhr.setRequestHeader("Content-Type", file.type);

    // Set timeout to 15 minutes for large files
    xhr.timeout = 15 * 60 * 1000;

    xhr.send(file);
  });
}
