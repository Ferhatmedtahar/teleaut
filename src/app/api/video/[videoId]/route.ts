// app/api/videos/[videoId]/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const supabase = await createClient();

// Bunny Stream API credentials
const STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    // First check if we have this video in our database
    const { data: videoData, error: dbError } = await supabase
      .from("videos")
      .select("*")
      .eq("bunny_video_id", videoId)
      .single();

    if (dbError) {
      console.error("Database error fetching video:", dbError);
      return NextResponse.json(
        { error: "Video not found in database" },
        { status: 404 }
      );
    }

    // Fetch video details from Bunny Stream
    const response = await fetch(
      `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos/${videoId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          AccessKey: STREAM_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch video with status ${response.status}` },
        { status: response.status }
      );
    }

    const bunnyData = await response.json();

    // Combine our database data with Bunny data
    const combinedData = {
      ...videoData,
      streamDetails: {
        title: bunnyData.title,
        thumbnailUrl: bunnyData.thumbnailUrl,
        status: bunnyData.status,
        encodeProgress: bunnyData.encodeProgress,
        length: bunnyData.length,
        views: bunnyData.views,
        collectionId: bunnyData.collectionId,
        dateUploaded: bunnyData.dateUploaded,
        hasMP4Fallback: bunnyData.hasMP4Fallback,
        renditions: bunnyData.renditions,
      },
    };

    return NextResponse.json(combinedData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Internal server error:", error);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
}

// // app/api/videos/[videoId]/statistics/route.ts
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { videoId: string } }
// ) {
//   try {
//     const videoId = params.videoId;
//     const { searchParams } = new URL(request.url);

//     // Parse date range if provided
//     const startDate = searchParams.get("start") || undefined;
//     const endDate = searchParams.get("end") || undefined;

//     let url = `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos/${videoId}/statistics`;

//     if (startDate && endDate) {
//       url += `?dateFrom=${encodeURIComponent(
//         startDate
//       )}&dateTo=${encodeURIComponent(endDate)}`;
//     }

//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//         AccessKey: STREAM_API_KEY,
//       },
//     });

//     if (!response.ok) {
//       return NextResponse.json(
//         { error: `Failed to fetch statistics with status ${response.status}` },
//         { status: response.status }
//       );
//     }

//     const statistics = await response.json();

//     return NextResponse.json(statistics);
//   } catch (error: any) {
//     console.error("Error fetching video statistics:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
