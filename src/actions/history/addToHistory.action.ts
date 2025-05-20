"use server";

import { createClient } from "@/lib/supabase/server";

export async function addToHistory(userId: string, videoId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("history").insert({
    user_id: userId,
    video_id: videoId,
  });
  if (error) {
    console.error("Error adding video to history:", error);
    return { success: false, message: "Failed to add video to history" };
  }
  return { success: true, message: "Video added to history" };
}
