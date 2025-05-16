import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  console.log("excuted the api route now");
  const { videoId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("videos")
    .select("status")
    .eq("id", videoId)
    .single();

  console.log(data);
  if (error) {
    console.error("Error fetching video status from Supabase:", error);
    return NextResponse.json(
      { message: "Failed to fetch video status from database" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 200 });
}
