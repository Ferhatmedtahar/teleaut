"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAllUsers() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("id")
    .order("created_at", { ascending: false });
  return {
    success: true,
    data: users || [],
  };
}
