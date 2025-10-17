"use server";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/entities/Chat.interface";

export async function getUserChats(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("chats")
    .select(
      `
      *,
      participants:chat_participants(
        *,
        user:users(id, first_name, last_name, role, profile_url)
      )
    `
    )
    .in(
      "id",
      supabase.from("chat_participants").select("chat_id").eq("user_id", userId)
    )
    .order("last_message_at", { ascending: false, nullsFirst: false });

  return { data: data as Chat[], error };
}
