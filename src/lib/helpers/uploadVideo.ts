export async function uploadVideoSecureClient(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  if (!file) throw new Error("Video file is required");

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    console.log(`Starting secure client upload for: ${file.name}`);
    console.log("base url", BASE_URL);
    const authResponse = await fetch(`${BASE_URL}/api/video/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });

    console.log("auth response", authResponse);
    if (!authResponse.ok) {
      throw new Error(
        "Échec de l'obtention des informations d'identification de téléchargement"
      );
    }

    const { libraryId, apiKey } = await authResponse.json();
    console.log("libraryId", libraryId);
    console.log("apiKey", apiKey);
    const videoId = await createVideoObjectClient(libraryId, apiKey, file.name);
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;

    await uploadToBunnyDirect(file, uploadUrl, apiKey, onProgress);

    return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
  } catch (error) {
    console.error("Upload error:", error);
    throw new Error("échec du téléchargement");
  }
}

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
