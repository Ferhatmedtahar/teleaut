import { createClient } from "@/lib/supabase/server"; // Adjust this import path if necessary
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // console.log("📩 Webhook received:", body);

    const { VideoGuid, Status } = body;

    if (!VideoGuid || Status === undefined) {
      console.error("Webhook payload missing VideoGuid or Status");
      return NextResponse.json(
        { message: "Missing required fields in webhook payload" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const video_url = `https://iframe.mediadelivery.net/embed/426479/${VideoGuid}`;
    console.log(
      `Updating video status for VideoGuid: ${VideoGuid}, Status: ${Status}, video_url: ${video_url}`
    );
    const { data, error } = await supabase
      .from("videos")
      .update({ status: Status })
      .eq("video_url", video_url);

    if (error) {
      console.error("Error updating video status in Supabase:", error);

      return NextResponse.json(
        { message: "Failed to update video status in database" },
        { status: 500 }
      );
    }

    console.log(
      `Video status updated successfully for VideoGuid: ${VideoGuid}, new Status: ${Status}`
    );

    return NextResponse.json(
      { message: "Webhook received and processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { message: "Internal Server Error processing webhook" },
      { status: 500 }
    );
  }
}
