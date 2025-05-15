"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

// Get related videos
export async function getRelatedVideos(
  currentVideoId: string,
  subject: string,
  classValue: string,
  limit = 8
) {
  const cookieStore = cookies();
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
    .or(`subject.eq.${subject},class.eq.${classValue}`)
    .order("views", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching related videos:", error);
    return [];
  }

  return data || [];
}
