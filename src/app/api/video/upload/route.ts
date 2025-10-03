import fs from "fs";
import { writeFile } from "fs/promises";
import https from "https";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  try {
    const { fileBase64, fileName, fileType, userId } = await req.json();

    if (!fileBase64 || !fileName || !fileType || !userId) {
      return NextResponse.json(
        { message: "Missing file, filename, type, or userId" },
        { status: 400 }
      );
    }

    // Strip base64 header if present
    const base64Data = fileBase64.split(",").pop();
    const buffer = Buffer.from(base64Data!, "base64");

    const ext = fileName.split(".").pop();
    const uniqueName = `${uuidv4()}.${ext}`;
    const tempPath = join("/tmp", uniqueName);

    await writeFile(tempPath, buffer);

    const videoUrl = await uploadToBunnyStream(tempPath, uniqueName, fileType);

    // Clean up
    try {
      fs.unlinkSync(tempPath);
    } catch (err) {
      console.error("Failed to clean up temp file:", err);
    }

    return NextResponse.json({ success: true, videoUrl });
  } catch (err: any) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      { message: err.message ?? "Upload failed" },
      { status: 500 }
    );
  }
}

async function uploadToBunnyStream(
  filePath: string,
  fileName: string,
  contentType: string
): Promise<string> {
  const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
  const accessKey = process.env.BUNNY_STREAM_API_KEY!;
  const host = "video.bunnycdn.com";

  // Step 1: Create the video object first
  const videoId = await createVideoObject(libraryId, accessKey, fileName);

  // Step 2: Upload the actual video content
  await uploadVideoContent(
    filePath,
    libraryId,
    videoId,
    accessKey,
    contentType
  );

  return `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;
}

async function createVideoObject(
  libraryId: string,
  accessKey: string,
  title: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      title: title,
      collectionId: "",
      thumbnailTime: 0,
    });

    const options = {
      hostname: "video.bunnycdn.com",
      path: `/library/${libraryId}/videos`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: accessKey,
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode !== 200 && res.statusCode !== 201) {
          reject(`Failed to create video object: ${responseData}`);
          return;
        }

        try {
          const parsedData = JSON.parse(responseData);
          resolve(parsedData.guid || "");
        } catch (error) {
          reject("Error parsing response: " + error);
        }
      });
    });

    req.on("error", (error) => {
      reject(`Error creating video object: ${error.message}`);
    });

    req.write(data);
    req.end();
  });
}

async function uploadVideoContent(
  filePath: string,
  libraryId: string,
  videoId: string,
  accessKey: string,
  contentType: string
): Promise<void> {
  const stats = fs.statSync(filePath);
  const fileStream = fs.createReadStream(filePath);

  return new Promise((resolve, reject) => {
    const options = {
      hostname: "video.bunnycdn.com",
      path: `/library/${libraryId}/videos/${videoId}`,
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        AccessKey: accessKey,
        "Content-Length": stats.size,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(`Failed to upload video content: ${responseData}`);
          return;
        }

        resolve();
      });
    });

    req.on("error", (error) => {
      reject(`Error uploading video content: ${error.message}`);
    });

    fileStream.pipe(req);
  });
}
