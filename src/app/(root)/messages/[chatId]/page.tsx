import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getChatMessages } from "@/actions/chats/getChatMessages";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ChatContainer from "../_components/ChatContainer";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  // Get current user
  const { user } = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch initial messages on server
  const { data: initialMessages } = await getChatMessages(chatId);

  // Optionally: Fetch chat details (for header, participants, etc.)
  const supabase = await createClient();
  const { data: chat } = await supabase
    .from("chats")
    .select(
      `
      *,
      participants:chat_participants(
        *,
        user:users(id, first_name, last_name, profile_url, role)
      )
    `
    )
    .eq("id", chatId)
    .single();

  const otherParticipant = chat?.participants?.find(
    (p: any) => p.user_id !== user.id
  );

  return (
    <ChatContainer
      chatId={chatId}
      currentUserId={user.id}
      initialMessages={initialMessages || []}
      chat={chat}
      otherParticipant={otherParticipant}
    />
  );
}
