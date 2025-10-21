"use server";
import { createClient } from "@/lib/supabase/client";
import { roles } from "@/types/roles.enum";

export async function findOrCreateOneOnOneChat(
  userId1: string,
  userId2: string
) {
  const supabase = createClient();

  // Fetch both users' roles
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, role")
    .in("id", [userId1, userId2]);

  if (usersError || !users || users.length !== 2) {
    return { chatId: null, error: "Unable to fetch user information" };
  }

  const user1Role = users.find((u) => u.id === userId1)?.role;
  const user2Role = users.find((u) => u.id === userId2)?.role;

  // Prevent patient-to-patient chats
  if (user1Role === roles.patient && user2Role === roles.patient) {
    return {
      chatId: null,
      error: "Les patients ne peuvent pas créer de conversations entre eux",
    };
  }

  // Check for existing chat
  const { data: existingChats } = await supabase
    .from("chat_participants")
    .select("chat_id")
    .eq("user_id", userId1);

  if (existingChats) {
    for (const participant of existingChats) {
      const { data: otherParticipantData } = await supabase
        .from("chat_participants")
        .select("user_id, chats(type)")
        .eq("chat_id", participant.chat_id)
        .eq("user_id", userId2)
        .single();

      if (otherParticipantData) {
        const chats = otherParticipantData.chats as
          | { type: string }
          | { type: string }[];
        const chatType = Array.isArray(chats) ? chats[0]?.type : chats?.type;

        if (chatType === "1-1") {
          return { chatId: participant.chat_id, isNew: false, error: "" };
        }
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

  return { chatId: newChat.id, isNew: true, error: "" };
}
