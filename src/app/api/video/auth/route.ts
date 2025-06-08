import { createClient } from "@/lib/supabase/server";
import { roles } from "@/types/roles.enum";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("id , role")
    .eq("id", userId)
    .single();

  if (error || !data || data.role !== roles.teacher) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "UnAuthorized Access" }, { status: 401 });
  }

  return NextResponse.json({
    libraryId: process.env.BUNNY_STREAM_LIBRARY_ID!,
    apiKey: process.env.BUNNY_STREAM_API_KEY!,
  });
}
