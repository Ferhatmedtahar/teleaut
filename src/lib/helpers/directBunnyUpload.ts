export async function uploadVideoDirectly(
  file: File,
  userId: string
): Promise<string> {
  if (!file) throw new Error("Video file is required");

  // const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  try {
    const response = await fetch(`/api/video/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("error", error);
      throw new Error(error.message ?? "Échec du téléchargement de la vidéo");
    }

    const result = await response.json();
    return result.videoUrl;
  } catch (error) {
    console.error("error", error);
    throw new Error("Échec du téléchargement de la vidéo");
  }
}

// export async function uploadVideoDirectly(
//   file: File,
//   userId: string,
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   if (!file) throw new Error("Video file is required");

//   console.log("FILE IN DIRECT UPLOAD BUNNY", file, userId);
//   try {
//     const credentialsResponse = await fetch("/api/video/upload", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         file: file,
//         userId: userId,
//       }),
//     });

//     if (!credentialsResponse.ok) {
//       throw new Error("Failed to get upload credentials");
//     }

//     const { videoId, libraryId, accessKey } = await credentialsResponse.json();

//     // Step 2: Upload directly to Bunny Stream
//     return await uploadToBunnyStreamDirect(
//       file,
//       libraryId,
//       videoId,
//       accessKey,
//       onProgress
//     );
//   } catch (error) {
//     console.error("Direct upload error:", error);
//     throw new Error("Failed to upload video directly");
//   }
// }
// export async function uploadVideoDirectly(
//   file: File,
//   userId: string,
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   if (!file) throw new Error("Video file is required");

// const formData = new FormData();
// formData.append("file", file);
// formData.append("userId", userId);

//   const credentialsResponse = await fetch("/api/video/upload", {
//     method: "POST",
//     body: formData, // <- no headers here, browser sets them
//   });

//   if (!credentialsResponse.ok) {
//     throw new Error("Failed to get upload credentials");
//   }

//   const { videoId, libraryId, accessKey } = await credentialsResponse.json();

//   return await uploadToBunnyStreamDirect(
//     file,
//     libraryId,
//     videoId,
//     accessKey,
//     onProgress
//   );
// }

// async function uploadToBunnyStreamDirect(
//   file: File,
//   libraryId: string,
//   videoId: string,
//   accessKey: string,
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   return new Promise((resolve, reject) => {
//     const xhr = new XMLHttpRequest();

//     // Track upload progress
//     if (onProgress) {
//       xhr.upload.addEventListener("progress", (event) => {
//         if (event.lengthComputable) {
//           const progress = Math.round((event.loaded / event.total) * 100);
//           onProgress(progress);
//         }
//       });
//     }

//     xhr.addEventListener("load", () => {
//       if (xhr.status === 200) {
//         const videoUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
//         resolve(videoUrl);
//       } else {
//         reject(new Error(`Upload failed with status: ${xhr.status}`));
//       }
//     });

//     xhr.addEventListener("error", () => {
//       reject(new Error("Network error during upload"));
//     });

//     xhr.addEventListener("abort", () => {
//       reject(new Error("Upload was aborted"));
//     });

//     xhr.open(
//       "PUT",
//       `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`
//     );
//     xhr.setRequestHeader("Content-Type", file.type);
//     xhr.setRequestHeader("AccessKey", accessKey);

//     xhr.send(file);
//   });
// }
