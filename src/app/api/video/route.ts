import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
const supabase = await createClient();
const STREAM_API_KEY = process.env.BUNNY_STREAM_API_KEY!;
const STREAM_LIBRARY_ID = process.env.BUNNY_STREAM_LIBRARY_ID!;
// app/api/videos/route.ts - For listing all videos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    // Build supabase query
    let query = supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Database error fetching videos:", error);
      return NextResponse.json(
        { error: "Failed to fetch videos" },
        { status: 500 }
      );
    }

    // For each video, fetch additional details from Bunny
    const videoDetailsPromises = data.map(async (video) => {
      try {
        const response = await fetch(
          `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos/${video.bunny_video_id}`,
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
          console.warn(
            `Failed to fetch details for video ${video.bunny_video_id}`
          );
          return {
            ...video,
            streamDetails: null,
          };
        }

        const bunnyData = await response.json();

        return {
          ...video,
          streamDetails: {
            thumbnailUrl: bunnyData.thumbnailUrl,
            status: bunnyData.status,
            views: bunnyData.views,
            length: bunnyData.length,
          },
        };
      } catch (err) {
        console.warn(
          `Error fetching details for video ${video.bunny_video_id}:`,
          err
        );
        return {
          ...video,
          streamDetails: null,
        };
      }
    });

    const videosWithDetails = await Promise.all(videoDetailsPromises);

    return NextResponse.json({
      videos: videosWithDetails,
      pagination: {
        page,
        limit,
        total: count,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error fetching videos:", error.message);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
}

// app/api/videos/route.ts - For creating a new video
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, userId, collectionId = "default" } = body;

    if (!title || !userId) {
      return NextResponse.json(
        { error: "Title and userId are required" },
        { status: 400 }
      );
    }

    // Create video in Bunny Stream
    const bunnyResponse = await fetch(
      `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          AccessKey: STREAM_API_KEY,
        },
        body: JSON.stringify({
          title,
          collectionId,
        }),
      }
    );

    if (!bunnyResponse.ok) {
      const errorData = await bunnyResponse.json();
      return NextResponse.json(
        {
          error: errorData.message ?? "Failed to create video in Bunny Stream",
        },
        { status: bunnyResponse.status }
      );
    }

    const bunnyData = await bunnyResponse.json();
    const bunnyVideoId = bunnyData.guid;

    // Store video reference in Supabase
    const { data: videoRecord, error } = await supabase
      .from("videos")
      .insert({
        title,
        user_id: userId,
        bunny_video_id: bunnyVideoId,
        collection_id: collectionId,
        status: "created",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Database error creating video record:", error);
      return NextResponse.json(
        { error: "Failed to store video record" },
        { status: 500 }
      );
    }

    // Return the created video data and upload URL
    return NextResponse.json({
      video: videoRecord,
      bunnyVideoId,
      uploadUrl: `https://video.bunnycdn.com/library/${STREAM_LIBRARY_ID}/videos/${bunnyVideoId}`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating video:", error.message);
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  }
}
