"use server";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/entities/Chat.interface";

export async function getChatMessages(chatId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:users(id, first_name, last_name, profile_url)
    `
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  return { data: data as Message[], error };
}
