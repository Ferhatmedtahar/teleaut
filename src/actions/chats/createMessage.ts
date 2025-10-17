"use server";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/entities/Chat.interface";

export async function sendMessage(
  chatId: string,
  senderId: string,
  content: string
) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      chat_id: chatId,
      sender_id: senderId,
      content,
    })
    .select()
    .single();

  return { data, error };
}
