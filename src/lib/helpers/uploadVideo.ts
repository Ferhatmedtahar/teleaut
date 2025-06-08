export async function uploadVideoUtil(
  file: File,
  userId: string
): Promise<string> {
  if (!file) throw new Error("Video file is required");

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("userId", userId);
  try {
    const response = await fetch(`${BASE_URL}/api/video/upload`, {
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
