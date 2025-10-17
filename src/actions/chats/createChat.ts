"use server";
import { createClient } from "@/lib/supabase/client";

export async function findOrCreateOneOnOneChat(
  userId1: string,
  userId2: string
) {
  const supabase = createClient();

  const { data: existingChats } = await supabase
    .from("chat_participants")
    .select("chat_id")
    .eq("user_id", userId1);

  if (existingChats) {
    for (const participant of existingChats) {
      const { data: otherParticipant } = await supabase
        .from("chat_participants")
        .select("user_id, chats(type)")
        .eq("chat_id", participant.chat_id)
        .eq("user_id", userId2)
        .single();

      if (otherParticipant && otherParticipant.chats?.type === "1-1") {
        return { chatId: participant.chat_id, isNew: false };
      }
    }
  }

  // Create new chat
  const { data: newChat, error } = await supabase
    .from("chats")
    .insert({ type: "1-1" })
    .select()
    .single();

  if (error || !newChat) return { chatId: null, error };

  // Add both participants
  await supabase.from("chat_participants").insert([
    { chat_id: newChat.id, user_id: userId1 },
    { chat_id: newChat.id, user_id: userId2 },
  ]);

  return { chatId: newChat.id, isNew: true };
}
