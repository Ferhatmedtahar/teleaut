import { createClient } from "@/lib/supabase/server";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

import fs from "fs";
import https from "https";
import { Http2ServerResponse } from "http2";
import { IncomingMessage } from "http";
export async function POST(request: NextRequest) {
  try {
    console.log("File upload route hit!");
    const formData = await request.formData();
    console.log("form data here", Object.fromEntries(formData));

    const file = formData.get("file") as File;
    const fileType = formData.get("fileType") as string;
    const userId = formData.get("userId") as string;
    if (!file || !fileType || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fileExtension = file.name.split(".").pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;

    console.log("fileExtension,uniqueFilename", fileExtension, uniqueFilename);
    let folderPath = "";
    switch (fileType) {
      case "profile_picture":
        folderPath = "profiles";
        break;
      case "cover_picture":
        folderPath = "profiles";
        break;
      case "diploma":
        folderPath = "documents/diplomas";
        break;
      case "idFront":
        folderPath = "documents/id-cards/front";
        break;
      case "idBack":
        folderPath = "documents/id-cards/back";
        break;
      default:
        folderPath = "other";
    }

    // Add user ID to path if provided
    const finalPath = userId
      ? `${folderPath}/${userId}/${uniqueFilename}`
      : `${folderPath}/${uniqueFilename}`;

    console.log("finalPath", finalPath);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempPath = join("/tmp", uniqueFilename);
    await writeFile(tempPath, buffer);

    const url = await uploadToBunny(tempPath, finalPath, file.type);

    // if (fileType === "video") {
    //   await requestVideoConversion(finalPath);
    // }

    console.log("url", url);
    if (userId) {
      await storeFileReference(userId, fileType, url);
    }

    return NextResponse.json({
      success: true,
      url,
      path: finalPath,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Upload error:", error.message);
      return NextResponse.json(
        { error: error.message ?? "Upload failed" },
        { status: 500 }
      );
    }
  }
}

async function uploadToBunny(
  filePath: string,
  destinationPath: string,
  contentType: string
): Promise<string> {
  const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE!;
  const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
  const HOSTNAME = process.env.BUNNY_HOST!;

  const fileStream = fs.createReadStream(filePath);
  const stats = fs.statSync(filePath);

  return new Promise((resolve, reject) => {
    const options = {
      method: "PUT",
      host: HOSTNAME,
      path: `/${STORAGE_ZONE_NAME}/${destinationPath}`,
      headers: {
        AccessKey: ACCESS_KEY,
        "Content-Type": contentType || "application/octet-stream",
        "Content-Length": stats.size,
      },
    };

    const req = https.request(options, (res: IncomingMessage) => {
      let body = "";
      res.on("data", (chunk: Buffer) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          // Construct the CDN URL
          const cdnUrl = `https://${
            process.env.BUNNY_PULL_ZONE ?? HOSTNAME
          }/${STORAGE_ZONE_NAME}/${destinationPath}`;
          resolve(cdnUrl);
        } else {
          reject(`Upload failed with status ${res.statusCode}: ${body}`);
        }
      });
    });

    req.on("error", reject);
    fileStream.pipe(req);
  });
}

async function storeFileReference(
  userId: string,
  fileType: string,
  url: string
): Promise<void> {
  console.log("storeFileReference called", userId, fileType, url);
  const supabase = await createClient();
  const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE!;
  const hostname = process.env.BUNNY_HOST!;
  const file_path = url.replace(`https://${hostname}/${STORAGE_ZONE_NAME}`, "");
  // Store file reference in Supabase
  const { error } = await supabase.from("user_files").insert({
    user_id: userId,
    file_type: fileType,
    file_url: url,
    file_path,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to store file reference:", error);
    throw new Error("Failed to store file reference in database");
  }
}

// async function requestVideoConversion(videoPath: string): Promise<void> {
//   // For video files, if you want to create HLS streams for adaptive streaming
//   // You would call the Bunny Stream API here
//   // This is a placeholder function - implement according to your Bunny Stream account

//   const STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY;
//   const STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID;

//   // Example implementation - would need to be adjusted for your specific setup
//   if (STREAM_API_KEY && STREAM_LIBRARY_ID) {
//     try {
//       const response = await fetch(
//         `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos`,
//         {
//           method: "POST",
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//             AccessKey: STREAM_API_KEY,
//           },
//           body: JSON.stringify({
//             title: videoPath.split("/").pop(),
//             collectionId: "default",
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Video creation failed with status ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Video conversion requested:", data);

//       // You would then need to upload the actual video file to the created video ID
//       // This is a simplified example
//     } catch (error) {
//       console.error("Error requesting video conversion:", error);
//     }
//   }
// }

// export async function POST(request: Request) {}
// import https from "https";
// import multer from "multer";
// import type { NextApiRequest, NextApiResponse } from "next";
// type Data = any;
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// export const config = {
//   api: {
//     bodyParser: false, // Disable the default Next.js body parsing
//   },
// };
// export async function handler(
//   req: NextApiRequest | any,
//   res: NextApiResponse<Data> | any
// ) {
//   const STORAGE_ZONE_NAME = "zonegoeshere";
//   const HOSTNAME = `getthisfromthedashboard>storagezone>ftpandapiaccess`;
//   const FILENAME_TO_UPLOAD = `testing.png`;
//   const ACCESS_KEY = "keygoeshere";
//   const options = {
//     method: "PUT",
//     host: HOSTNAME,
//     path: `/${STORAGE_ZONE_NAME}/test/${FILENAME_TO_UPLOAD}`,
//     headers: {
//       AccessKey: ACCESS_KEY,
//       "Content-Type": "application/octet-stream",
//     },
//   };

//   upload.single("file")(req, res, (err) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }

//     const fileBuffer = req.file.buffer;

//     const request = https.request(options, (resp) => {
//       resp.on("data", (chunk) => {
//         console.log(chunk.toString("utf8"));
//       });
//     });
//     request.on("error", (error: any) => {
//       console.error(error);
//     });
//     request.write(fileBuffer);
//     request.end();
//     return res.status(200).json({ body: "" });
//   });
//   res.status(200).json({ body: "Upload successfull" });
// }
// export default handler;

// import { NextRequest, NextResponse } from "next/server";
// import formidable from "formidable";
// import fs from "fs";
// import https from "https";

// // This disables the built-in body parser
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req: NextRequest) {
//   const formData = await new Promise<{ file: formidable.File }>(
//     (resolve, reject) => {
//       const form = formidable({ multiples: false, keepExtensions: true });

//       form.parse(req as any, (err, fields, files) => {
//         if (err) return reject(err);
//         resolve({ file: files.file as formidable.File });
//       });
//     }
//   );

//   const file = formData.file;
//   const fileStream = fs.createReadStream(file.filepath);

//   const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE!;
//   const ACCESS_KEY = process.env.BUNNY_ACCESS_KEY!;
//   const HOSTNAME = process.env.BUNNY_HOST!; // e.g., "ny.storage.bunnycdn.com"

//   const options = {
//     method: "PUT",
//     host: HOSTNAME,
//     path: `/${STORAGE_ZONE_NAME}/${file.originalFilename}`,
//     headers: {
//       AccessKey: ACCESS_KEY,
//       "Content-Type": "application/octet-stream",
//       "Content-Length": file.size,
//     },
//   };

//   const upload = await new Promise<string>((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let body = "";
//       res.on("data", (chunk) => (body += chunk));
//       res.on("end", () => {
//         if (res.statusCode === 200 || res.statusCode === 201) {
//           const url = `https://${HOSTNAME}/${STORAGE_ZONE_NAME}/${file.originalFilename}`;
//           resolve(url);
//         } else {
//           reject(`Upload failed: ${body}`);
//         }
//       });
//     });

//     req.on("error", reject);
//     fileStream.pipe(req);
//   });

//   return NextResponse.json({ url: upload });
// }
