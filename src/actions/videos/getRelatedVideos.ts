"use server";

import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Get related videos
export async function getRelatedVideos(
  currentVideoId: string,
  subject: string,
  classValue: string,
  limit = 8
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return { success: false, data: [], message: "Not authenticated" };
  }

  const decoded = await verifyToken(token);
  if (!decoded || !decoded.id) {
    return { success: false, data: [], message: "Invalid token" };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("videos")
    .select(
      `
      id,
      title,
      thumbnail_url,
      created_at,
      views,
      teacher:teacher_id (
        id,
        name,
        avatar_url
      )
    `
    )
    .neq("id", currentVideoId)
    .eq("subject", subject)
    .eq("class", classValue)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related videos:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch related videos",
    };
  }

  return {
    success: true,
    data: data || [],
    message: "Related videos fetched successfully",
  };
}
