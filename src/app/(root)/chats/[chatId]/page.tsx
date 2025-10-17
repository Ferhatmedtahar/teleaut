// import React from "react";

// function page() {
//   return <div>page</div>;
// }

// export default page;

"use client";

import { sendMessage } from "@/actions/chats/createMessage";
import { getChatMessages } from "@/actions/chats/getChatMessages";
import { subscribeToChat } from "@/actions/chats/realtime";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/entities/Chat.interface";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setCurrentUserId(data.user.id);
    });

    // Subscribe to realtime updates
    const unsubscribe = subscribeToChat(chatId as string, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadMessages() {
    const { data } = await getChatMessages(chatId as string);
    if (data) setMessages(data);
  }

  async function handleSend() {
    if (!newMessage.trim()) return;

    await sendMessage(chatId as string, currentUserId, newMessage);
    setNewMessage("");
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender_id === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {message.sender_id !== currentUserId && (
                <p className="text-xs font-semibold mb-1">
                  {message.sender?.first_name}
                </p>
              )}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 border rounded px-4 py-2"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
