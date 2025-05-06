// export async function uploadToBunny(file: File, fileName: string) {
//   const storageZone = process.env.NEXT_PUBLIC_BUNNY_STORAGE_ZONE!;
//   const apiKey = process.env.BUNNY_API_KEY!;
//   const region = "ny"; // change based on your setup
//   const uploadUrl = `https://${storageZone}.storage.bunnycdn.com/${fileName}`;

//   const res = await fetch(uploadUrl, {
//     method: "PUT",
//     headers: {
//       AccessKey: apiKey,
//       "Content-Type": file.type,
//     },
//     body: file,
//   });

//   if (!res.ok) {
//     throw new Error(`Failed to upload file: ${res.statusText}`);
//   }

//   return `https://${region}.bunnycdn.com/${storageZone}/${fileName}`;
// }
