export async function uploadFile(
  file: File,
  fileType: string,
  userId: string
): Promise<string> {
  if (!file) throw new Error(`${fileType} file is required`);
  const BASE_URL = process.env.SITE_URL ?? "http://localhost:3000";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  formData.append("userId", userId);
  try {
    const response = await fetch(
      `${BASE_URL}/api/upload/upload_file_to_bunny`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();

      throw new Error(error.message ?? `Failed to upload ${fileType}`);
    }

    const result = await response.json();
    return result.url;
  } catch (e) {
    console.error(e);
    throw new Error(`Failed to upload ${fileType}`);
  }
}
