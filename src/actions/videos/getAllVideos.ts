"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllVideos() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("videos")
    .select("id")
    .order("created_at", { ascending: false });
  return {
    success: true,
    data: videos || [],
  };
}
