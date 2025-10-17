import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/entities/Chat.interface";

export function subscribeToChat(
  chatId: string,
  onNewMessage: (message: Message) => void
) {
  const supabase = createClient();

  const channel = supabase
    .channel(`chat:${chatId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `chat_id=eq.${chatId}`,
      },
      async (payload) => {
        // Fetch the complete message with sender info
        const { data } = await supabase
          .from("messages")
          .select(
            `
            *,
            sender:users(id, first_name, last_name, profile_url)
          `
          )
          .eq("id", payload.new.id)
          .single();

        if (data) {
          onNewMessage(data as Message);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
