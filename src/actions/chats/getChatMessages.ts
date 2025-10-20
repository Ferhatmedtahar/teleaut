"use server";
import { createClient } from "@/lib/supabase/server";

export async function getChatMessages(
  chatId: string,
  limit: number = 40,
  offset: number = 0
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      *,
      sender:users!sender_id(id, first_name, last_name, profile_url)
    `
    )
    .eq("chat_id", chatId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Error fetching messages:", error);
    return { data: null, error };
  }

  // Reverse to show oldest first in UI
  return { data: data?.reverse() || [], error: null };
}
// "use server";
// import { createClient } from "@/lib/supabase/client";
// import { Message } from "@/types/entities/Chat.interface";

// export async function getChatMessages(chatId: string) {
//   const supabase = createClient();

//   const { data, error } = await supabase
//     .from("messages")
//     .select(
//       `
//       *,
//       sender:users(id, first_name, last_name, profile_url)
//     `
//     )
//     .eq("chat_id", chatId)
//     .order("created_at", { ascending: true });

//   return { data: data as Message[], error };
// }
