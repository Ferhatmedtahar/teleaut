import { MessageBubble } from "../_components/message-bubble";
import type { Message } from "../_lib/types";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No messages yet. Start the conversation!
      </div>
    );
  }

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};

  messages.forEach((message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return (
    <div className="space-y-6 ">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="space-y-3">
          <div className="flex justify-center">
            <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {date}
            </div>
          </div>
          {dateMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUserId}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
