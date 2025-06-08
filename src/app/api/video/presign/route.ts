import { NextRequest, NextResponse } from "next/server";
import https from "https";

export async function POST(req: NextRequest) {
  try {
    const { fileName, userId } = await req.json();

    if (!fileName || !userId) {
      return NextResponse.json(
        { message: "Missing fileName or userId" },
        { status: 400 }
      );
    }

    const libraryId = process.env.BUNNY_STREAM_LIBRARY_ID!;
    const accessKey = process.env.BUNNY_STREAM_API_KEY!;

    if (!libraryId || !accessKey) {
      console.error("Missing Bunny Stream environment variables");
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log(`Creating video object for user: ${userId}, file: ${fileName}`);

    // Create video object in Bunny Stream
    const videoId = await createVideoObject(libraryId, accessKey, fileName);

    // Return the direct upload URL and video info
    const uploadUrl = `https://video.bunnycdn.com/library/${libraryId}/videos/${videoId}`;
    const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}`;

    console.log(`Video created successfully. ID: ${videoId}`);

    return NextResponse.json({
      success: true,
      videoId,
      uploadUrl,
      embedUrl,
      accessKey, // Client needs this for the PUT request
      libraryId,
    });
  } catch (error: any) {
    console.error("Create presigned URL failed:", error);
    return NextResponse.json(
      { message: error.message ?? "Failed to create upload URL" },
      { status: 500 }
    );
  }
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
          console.error(`Bunny API Error: ${res.statusCode} - ${responseData}`);
          reject(`Failed to create video object: ${responseData}`);
          return;
        }

        try {
          const parsedData = JSON.parse(responseData);
          const videoId = parsedData.guid;
          if (!videoId) {
            reject("No video ID returned from Bunny Stream");
            return;
          }
          resolve(videoId);
        } catch (error) {
          reject("Error parsing Bunny Stream response: " + error);
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
