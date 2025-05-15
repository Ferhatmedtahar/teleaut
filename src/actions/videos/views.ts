"use server";

import { verifyToken } from "@/app/(auth)/_lib/verifyToken"; // update this path if needed
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function incrementVideoView(videoId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const supabase = await createClient();

  let userId: string | null = null;

  if (token) {
    try {
      const decoded = await verifyToken(token);
      userId = decoded.id;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // Check if the user already viewed this video
  const { data: existingView, error: viewError } = await supabase
    .from("video_views")
    .select("*")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single();

  if (viewError && viewError.code !== "PGRST116") {
    console.error("Error checking existing view:", viewError);
    return { success: false, message: "Failed to check existing view" };
  }

  if (!existingView) {
    // New unique view: insert and increment
    const { error: insertError } = await supabase.from("video_views").insert({
      video_id: videoId,
      user_id: userId,
    });

    if (insertError) {
      console.error("Error recording user view:", insertError);
      return { success: false, message: "Failed to create user view" };
    }

    const { error } = await supabase.rpc("increment_video_views", {
      video_id: videoId,
    });

    if (error) {
      console.error("Error incrementing view count:", error);
      return { success: false, message: "Failed to increment view count" };
    }

    return { success: true, message: "View recorded successfully" };
  }
}
