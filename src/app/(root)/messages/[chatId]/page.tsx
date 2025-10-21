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

  // Get current user
  const { user } = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // Fetch chat details with participants
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

  // Check if chat exists
  if (error || !chat) {
    notFound();
  }

  // SECURITY CHECK: Verify current user is a participant
  const isParticipant = chat.participants?.some(
    (p: any) => p.user_id === user.id
  );

  if (!isParticipant) {
    // User is not authorized to view this chat
    notFound(); // or redirect("/chats") if you prefer
  }

  // Now safely fetch messages since user is authorized
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
