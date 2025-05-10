"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChatHeader } from "../_components/chat-header";
import { MessageInput } from "../_components/message-input";
import { MessageList } from "../_components/message-list";
import { useChat } from "../_context/chat-context";

export default function ChatPage() {
  const { chatId } = useParams();
  // const { user } = useAuth();
  const user = { id: "user1", username: "testUser" }; // Mock user for demonstration
  const { chats, messages, sendMessage, loadMessages } = useChat();
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find((chat) => chat.id === chatId);

  useEffect(() => {
    const fetchChat = async () => {
      if (typeof chatId === "string") {
        setIsLoading(true);
        await loadMessages(chatId);
        setIsLoading(false);
      }
    };

    fetchChat();
  }, [chatId as string, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (typeof chatId === "string" && user) {
      sendMessage(chatId, content, user.id);
    }
  };

  if (!currentChat) {
    return <div>Chat not found</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <ChatHeader chat={currentChat} />
      <div className="flex-1 overflow-y-auto p-4 bg-background/80">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <MessageList
            messages={messages[chatId as string] || []}
            currentUserId={user?.id || ""}
          />
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}
