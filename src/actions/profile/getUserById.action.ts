"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUserById(userId: string) {
  if (!userId) {
    return { success: false, message: "User not found" };
  }

  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (!user) return { success: false, message: "User not found" };

  return { success: true, message: "User found", user };
}
