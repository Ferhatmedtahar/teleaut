import { createClient } from "@/lib/supabase/server";
import fs from "fs";
import { writeFile } from "fs/promises";
import { IncomingMessage } from "http";
import https from "https";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

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

    let folderPath = "";
    switch (fileType) {
      case "profile_picture":
        folderPath = "profiles/profile-pictures";
        break;
      case "cover_picture":
        folderPath = "profiles/cover-pictures";
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

      case "video":
        folderPath = "videos";
        break;
      case "thumbnail":
        folderPath = "thumbnails";
        break;
      case "notes":
        folderPath = "notes";
        break;
      case "documents":
        folderPath = "documents";
        break;
      default:
        folderPath = "other";
    }

    // Add user ID to path if provided
    const finalPath = userId
      ? `${folderPath}/${userId}/${uniqueFilename}`
      : `${folderPath}/${uniqueFilename}`;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const tempPath = join("/tmp", uniqueFilename);
    await writeFile(tempPath, buffer);

    const url = await uploadToBunny(tempPath, finalPath, file.type);

    if (userId) {
      await storeFileReference(userId, fileType, file.name, url);
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
          const cdnUrl = `https://${process.env.BUNNY_PULL_ZONE}/${destinationPath}`;
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
  file_name: string,
  url: string
): Promise<void> {
  const supabase = await createClient();
  const hostname = process.env.BUNNY_PULL_ZONE!;
  const STORAGE_ZONE_NAME = process.env.BUNNY_STORAGE_ZONE!;

  const pullUrl = url.replace(`${STORAGE_ZONE_NAME}/`, "");
  const file_path = url.replace(`https://${hostname}/`, "");

  const { error } = await supabase.from("user_files").insert({
    user_id: userId,
    file_type: fileType,
    title: file_name,
    file_url: pullUrl,
    file_path,
    created_at: new Date().toISOString(),
  });
  if (error) {
    console.error("Failed to store file reference:", error);
    throw new Error("Failed to store file reference in database");
  }
}
