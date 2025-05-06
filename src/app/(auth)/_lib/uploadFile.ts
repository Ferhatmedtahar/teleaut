export async function uploadFile(
  file: File,
  fileType: string,
  userId: string
): Promise<string> {
  if (!file) throw new Error(`${fileType} file is required`);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileType", fileType);
  formData.append("userId", userId);

  const response = await fetch("/api/upload/uploadFileToBunny", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message ?? `Failed to upload ${fileType}`);
  }

  const result = await response.json();
  return result.url;
}
