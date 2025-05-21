"use server";

import { createClient } from "@/lib/supabase/server";

export async function addToHistory(userId: string, videoId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("history").upsert(
    {
      user_id: userId,
      video_id: videoId,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,video_id",
    }
  );

  if (error) {
    console.error("Error adding video to history:", error);
    return { success: false, message: "Failed to add video to history" };
  }

  return { success: true, message: "Video added/updated in history" };
}
