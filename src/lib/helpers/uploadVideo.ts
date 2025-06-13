export async function uploadVideoSecureClient(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!file) throw new Error("Video file is required");

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    const authResponse = await fetch(`${BASE_URL}/api/video/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    if (!authResponse.ok) {
      throw new Error("Failed to get upload credentials");
    }

    const { libraryId, apiKey } = await authResponse.json();

    const videoId = await createVideoObjectClient(libraryId, apiKey, file.name);
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

    await uploadToBunnyDirect(file, uploadUrl, apiKey, onProgress);

    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error(error instanceof Error ? error.message : "Upload failed");
  }
}
// export async function uploadVideoDirectlyClientOnly(
//   file: File,
//   userId: string,
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   if (!file) throw new Error("Video file is required");

//   // Validate file type
//   if (!file.type.startsWith("video/")) {
//     throw new Error("Please select a valid video file");
//   }

//   // Optional: Client-side size validation
//   const maxSize = 500 * 1024 * 1024; // 500MB
//   if (file.size > maxSize) {
//     throw new Error("File is too large. Maximum size is 500MB.");
//   }

//   // ⚠️ These would need to be environment variables exposed to the client
//   // This is the security trade-off - your API keys are visible in the browser
//   const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_STREAM_LIBRARY_ID!;
//   const BUNNY_API_KEY = process.env.NEXT_PUBLIC_BUNNY_STREAM_API_KEY!;

//   if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
//     throw new Error("Bunny Stream credentials not configured");
//   }

//   try {
//     console.log(`Starting direct client upload for: ${file.name}`);

//     // Step 1: Create video object directly from client
//     const videoId = await createVideoObjectClient(
//       BUNNY_LIBRARY_ID,
//       BUNNY_API_KEY,
//       file.name
//     );

//     // Step 2: Upload directly to Bunny Stream
//     const uploadUrl = `https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`;
//     await uploadToBunnyDirect(file, uploadUrl, BUNNY_API_KEY, onProgress);

//     // Step 3: Return embed URL
//     const embedUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}`;

//     console.log("Upload completed successfully!");
//     return embedUrl;
//   } catch (error) {
//     console.error("Upload error:", error);
//     throw new Error(error instanceof Error ? error.message : "Upload failed");
//   }
// }

// Client-side function to create video object in Bunny Stream
async function createVideoObjectClient(
  libraryId: string,
  apiKey: string,
  title: string
): Promise<string> {
  const response = await fetch(
    `https://video.bunnycdn.com/library/${libraryId}/videos`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: apiKey,
      },
      body: JSON.stringify({
        title: title,
        collectionId: "",
        thumbnailTime: 0,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to create video object: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();
  const videoId = data.guid;

  if (!videoId) {
    throw new Error("No video ID returned from Bunny Stream");
  }

  return videoId;
}

async function uploadToBunnyDirect(
  file: File,
  uploadUrl: string,
  accessKey: string,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

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

    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    xhr.addEventListener("timeout", () => {
      reject(new Error("Upload timeout"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("AccessKey", accessKey);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.timeout = 15 * 60 * 1000;

    xhr.send(file);
  });
}
