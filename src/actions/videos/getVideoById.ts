"use server";
import { createClient } from "@/lib/supabase/server";

// Get video by ID with teacher information
export async function getVideoById(id: string): Promise<{
  success: boolean;
  data?: any;
}> {
  const supabase = await createClient();
  console.log("server action get by id ", id);
  const { data, error } = await supabase
    .from("videos")
    .select(
      `
      *,
      users:teacher_id (
        id,
        name,
        avatar_url
      )
    `
    )
    .eq("id", id)
    .single();
  console.log("server action get by id ", data);

  if (error) {
    console.error("Error fetching video:", error);
    return {
      success: false,
    };
  }

  return {
    success: true,
    data,
  };
}
