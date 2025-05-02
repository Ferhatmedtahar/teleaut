"use client";

import type React from "react";

import { Send, Smile } from "lucide-react";
import { useState } from "react";
import { Button } from "../_components/ui/button";

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-3 border-t bg-background/80">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-4 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-500"
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </Button>
        </div>
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          disabled={!message.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
