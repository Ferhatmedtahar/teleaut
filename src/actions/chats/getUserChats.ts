"use server";
import { createClient } from "@/lib/supabase/server";
import { Chat } from "@/types/entities/Chat.interface";

export async function getUserChats(userId: string) {
  const supabase = await createClient();

  const { data: participantData, error: participantError } = await supabase
    .from("chat_participants")
    .select("chat_id")
    .eq("user_id", userId);

  if (participantError) {
    console.error("Error fetching chat participants:", participantError);
    return { success: false, data: [], error: participantError };
  }

  // Extract chat IDs
  const chatIds = participantData.map((p) => p.chat_id);

  if (chatIds.length === 0) {
    return { success: true, data: [], error: null };
  }

  // Now fetch the chats with all details
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
    .in("id", chatIds)
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Error fetching chats for user:", userId, error);
    return { success: false, data: [], error };
  }

  console.log("Fetched chats for user:", userId, data);
  return { success: true, data: data as Chat[], error: null };
}
// "use server";
// import { createClient } from "@/lib/supabase/client";
// import { Chat } from "@/types/entities/Chat.interface";

// export async function getUserChats(userId: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("chats")
//     .select(
//       `
//       *,
//       participants:chat_participants(
//         *,
//         user:users(id, first_name, last_name, role, profile_url)
//       )
//     `
//     )
//     .in(
//       "id",
//       supabase.from("chat_participants").select("chat_id").eq("user_id", userId)
//     )
//     .order("last_message_at", { ascending: false, nullsFirst: false });
//   if (error) {
//     console.error("Error fetching chats for user:", userId, error);
//     return { success: false, data: [], error };
//   }
//   console.log("Fetched chats for user:", userId, data);
//   return { success: true, data: data as Chat[], error };
// }
