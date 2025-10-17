"use server";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/entities/Chat.interface";

export async function getOrCreateGroupChat(
  type: "group_doctors" | "group_patients",
  currentUserId: string
) {
  const supabase = createClient();

  // Check if group chat exists
  const { data: existingChat } = await supabase
    .from("chats")
    .select("id")
    .eq("type", type)
    .single();

  if (existingChat) {
    // Check if user is already a participant
    const { data: isParticipant } = await supabase
      .from("chat_participants")
      .select("id")
      .eq("chat_id", existingChat.id)
      .eq("user_id", currentUserId)
      .single();

    if (!isParticipant) {
      // Add user as participant
      await supabase.from("chat_participants").insert({
        chat_id: existingChat.id,
        user_id: currentUserId,
      });
    }

    return { chatId: existingChat.id };
  }

  // Create new group chat
  const name = type === "group_doctors" ? "Doctors Group" : "Patients Group";
  const { data: newChat, error } = await supabase
    .from("chats")
    .insert({ type, name })
    .select()
    .single();

  if (error || !newChat) return { chatId: null, error };

  // Add current user as participant
  await supabase.from("chat_participants").insert({
    chat_id: newChat.id,
    user_id: currentUserId,
  });

  return { chatId: newChat.id };
}
