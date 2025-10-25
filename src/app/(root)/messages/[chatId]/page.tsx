import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getChatMessages } from "@/actions/chats/getChatMessages";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChatContainer from "../_components/ChatContainer";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const { chatId } = await params;

  const { user } = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const supabase = await createClient();
  const { data: chat, error } = await supabase
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

  if (error || !chat) {
    notFound();
  }

  const isParticipant = chat.participants?.some(
    (p: any) => p.user_id === user.id
  );

  if (!isParticipant) {
    notFound();
  }

  const { data: initialMessages } = await getChatMessages(chatId);

  const otherParticipant = chat.participants?.find(
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
