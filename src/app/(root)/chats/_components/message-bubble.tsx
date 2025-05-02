import type { Message } from "../_lib/types";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={cn("flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] rounded-lg px-4 py-2 text-sm",
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none border"
        )}
      >
        <div>{message.content}</div>
        <div className="flex items-center justify-end mt-1 space-x-1">
          <span className="text-xs opacity-70">{time}</span>
          {isOwn &&
            (message.read ? (
              <CheckCheck className="h-3 w-3 opacity-70" />
            ) : (
              <Check className="h-3 w-3 opacity-70" />
            ))}
        </div>
      </div>
    </div>
  );
}
