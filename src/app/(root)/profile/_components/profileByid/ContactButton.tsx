"use client";
import { findOrCreateOneOnOneChat } from "@/actions/chats/createChat";
import { Button } from "@/components/common/buttons/Button";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChatButton({
  currentUserId,
  targetUserId,
  targetUserName,
}: {
  currentUserId: string;
  targetUserId: string;
  targetUserName: string;
}) {
  const router = useRouter();
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const handleStartChat = async () => {
    setIsCreatingChat(true);
    try {
      const { chatId, error } = await findOrCreateOneOnOneChat(
        currentUserId,
        targetUserId
      );

      if (error) {
        toast.error(
          `Une erreur s'est produite lors de la création du chat` as string
        );
        return;
      }

      if (chatId) {
        router.push(`/messages?chatId=${chatId}`);
      }
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la création du chat");
      console.error("Error creating chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <Button
      className="w-full sm:w-auto flex items-center gap-2"
      onClick={handleStartChat}
      disabled={isCreatingChat}
    >
      <MessageCircle className="w-4 h-4" />
      {isCreatingChat ? "Chargement..." : `Discuter avec ${targetUserName}`}
    </Button>
  );
}
