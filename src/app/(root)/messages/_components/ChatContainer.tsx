"use client";

import { sendMessage } from "@/actions/chats/createMessage";
import { getChatMessages } from "@/actions/chats/getChatMessages";
import { subscribeToChat } from "@/actions/chats/realtime";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/entities/Chat.interface";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatContainerProps {
  chatId: string;
  currentUserId: string;
  initialMessages: Message[];
  chat?: any;
  otherParticipant?: any;
}

const MESSAGES_PER_PAGE = 40;

export default function ChatContainer({
  chatId,
  currentUserId,
  initialMessages,
  chat,
  otherParticipant,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialMessages.length >= MESSAGES_PER_PAGE
  );
  const [offset, setOffset] = useState(MESSAGES_PER_PAGE);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);
  const isInitialScroll = useRef(true);

  const router = useRouter();

  const loadMoreMessages = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const { data: olderMessages } = await getChatMessages(
        chatId,
        MESSAGES_PER_PAGE,
        offset
      );

      if (olderMessages && olderMessages.length > 0) {
        setMessages((prev) => [...olderMessages, ...prev]);
        setOffset((prev) => prev + olderMessages.length);
        setHasMore(olderMessages.length >= MESSAGES_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more messages:", error);
    } finally {
      setLoading(false);
    }
  }, [chatId, loading, hasMore, offset]);

  // Handle scroll for loading more messages
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // If user scrolls to top (within 100px), load more
    if (container.scrollTop < 100 && hasMore && !loading) {
      previousScrollHeight.current = container.scrollHeight;
      loadMoreMessages();
    }
  }, [hasMore, loading, loadMoreMessages]);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = subscribeToChat(chatId, (message) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    return () => unsubscribe();
  }, [chatId]);

  // Auto-scroll to bottom on new messages (only for new messages, not when loading old ones)
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (isInitialScroll.current) {
      // Initial load - scroll to bottom
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      isInitialScroll.current = false;
    } else if (container && !loading) {
      // Check if user was already at bottom before new message
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      if (isAtBottom) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, loading]);

  // Maintain scroll position after loading older messages
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container && previousScrollHeight.current > 0 && !loading) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeight.current;
      container.scrollTop = scrollDiff;
      previousScrollHeight.current = 0;
    }
  }, [messages, loading]);

  async function handleSend() {
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(chatId, currentUserId, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getChatName = () => {
    if (chat?.name) return chat.name;
    if (otherParticipant?.user) {
      return `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`;
    }
    return "Chat";
  };
  console.log("otherParticipant", otherParticipant);
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className=" bg-background border-b border-border/20 dark:border-border/90 px-4 py-3 flex items-center gap-3">
        <Button
          onClick={() => router.push("/messages")}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Link href={`/profile/${otherParticipant?.user?.id}`} className="">
          {otherParticipant?.user && (
            <div className="w-10 h-10 rounded-full bg-secondary-300 dark:bg-secondary-100 flex items-center justify-center flex-shrink-0">
              {otherParticipant.user.profile_url ? (
                <img
                  src={otherParticipant.user.profile_url}
                  alt=""
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-primary-700">
                  {otherParticipant.user.first_name?.[0]}
                </span>
              )}
            </div>
          )}
        </Link>

        <div className="flex-1">
          <h2 className="font-semibold">{getChatName()}</h2>
          {otherParticipant?.user && (
            <p className="text-xs text-gray-500 capitalize">
              {otherParticipant.user.role}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {/* Loading indicator at top */}
        {loading && (
          <div className="flex justify-center py-2">
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          </div>
        )}

        {/* Show "No more messages" when reached the end */}
        {!hasMore && messages.length > 0 && (
          <div className="flex justify-center py-2">
            <p className="text-xs text-gray-400">No more messages</p>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender_id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender_id === currentUserId
                    ? "bg-blue-500 dark:bg-blue-900 border border-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-primary-900 border text-gray-800 dark:text-gray-50 rounded-bl-none shadow-sm"
                }`}
              >
                {message.sender_id !== currentUserId && message.sender && (
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {message.sender.first_name}
                  </p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender_id === currentUserId
                      ? "text-blue-100"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(message.created_at).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/20 dark:border-border/90 bg-background p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 px-4 py-2"
          />
          <Button type="submit" disabled={!newMessage.trim() || sending}>
            {sending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
// "use client";

// import { sendMessage } from "@/actions/chats/createMessage";
// import { subscribeToChat } from "@/actions/chats/realtime";
// import { Button } from "@/components/common/buttons/Button";
// import { Input } from "@/components/ui/input";
// import { Message } from "@/types/entities/Chat.interface";
// import { ArrowLeft, Send } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";

// interface ChatContainerProps {
//   chatId: string;
//   currentUserId: string;
//   initialMessages: Message[];
//   chat?: any;
//   otherParticipant?: any;
// }

// export default function ChatContainer({
//   chatId,
//   currentUserId,
//   initialMessages,
//   chat,
//   otherParticipant,
// }: ChatContainerProps) {
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [newMessage, setNewMessage] = useState("");
//   const [sending, setSending] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   useEffect(() => {
//     // Subscribe to realtime updates
//     const unsubscribe = subscribeToChat(chatId, (message) => {
//       setMessages((prev) => {
//         // Prevent duplicates
//         if (prev.some((m) => m.id === message.id)) {
//           return prev;
//         }
//         return [...prev, message];
//       });
//     });

//     return () => unsubscribe();
//   }, [chatId]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   async function handleSend() {
//     if (!newMessage.trim() || sending) return;

//     setSending(true);
//     try {
//       await sendMessage(chatId, currentUserId, newMessage);
//       setNewMessage("");
//     } catch (error) {
//       console.error("Failed to send message:", error);
//       alert("Failed to send message. Please try again.");
//     } finally {
//       setSending(false);
//     }
//   }

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   // Get chat display name
//   const getChatName = () => {
//     if (chat?.name) return chat.name;
//     if (otherParticipant?.user) {
//       return `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`;
//     }
//     return "Chat";
//   };

//   return (
//     <div className="flex flex-col h-full bg-background ">
//       {/* Header */}
//       <div className="bg-background border-b  border-border/20 dark:border-border/90  px-4 py-3 flex items-center gap-3">
//         <button
//           onClick={() => router.push("/chats")}
//           className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
//         >
//           <ArrowLeft className="w-5 h-5" />
//         </button>

//         {/* Profile Picture */}
//         {otherParticipant?.user && (
//           <div className="w-10 h-10 rounded-full bg-secondary-300 dark:bg-secondary-100 flex items-center justify-center flex-shrink-0">
//             {otherParticipant.user.profile_url ? (
//               <img
//                 src={otherParticipant.user.profile_url}
//                 alt=""
//                 className="w-full h-full rounded-full object-cover"
//               />
//             ) : (
//               <span className="text-sm font-semibold text-gray-600">
//                 {otherParticipant.user.first_name?.[0]}
//               </span>
//             )}
//           </div>
//         )}

//         <div className="flex-1">
//           <h2 className="font-semibold">{getChatName()}</h2>
//           {otherParticipant?.user && (
//             <p className="text-xs text-gray-500 capitalize">
//               {otherParticipant.user.role}
//             </p>
//           )}
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full text-gray-400">
//             <p>No messages yet. Start the conversation!</p>
//           </div>
//         ) : (
//           messages.map((message) => (
//             <div
//               key={message.id}
//               className={`flex ${
//                 message.sender_id === currentUserId
//                   ? "justify-end"
//                   : "justify-start"
//               }`}
//             >
//               <div
//                 className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
//                   message.sender_id === currentUserId
//                     ? "bg-blue-500 dark:bg-blue-900 border border-blue-600 text-white rounded-br-none"
//                     : "bg-white dark:bg-primary-900 border text-gray-800 dark:text-gray-50 rounded-bl-none shadow-sm"
//                 }`}
//               >
//                 {message.sender_id !== currentUserId && message.sender && (
//                   <p className="text-xs font-semibold mb-1 opacity-70">
//                     {message.sender.first_name}
//                   </p>
//                 )}
//                 <p className="text-sm break-words">{message.content}</p>
//                 <p
//                   className={`text-xs mt-1 ${
//                     message.sender_id === currentUserId
//                       ? "text-blue-100"
//                       : "text-gray-400"
//                   }`}
//                 >
//                   {new Date(message.created_at).toLocaleTimeString("en-US", {
//                     hour: "2-digit",
//                     minute: "2-digit",
//                   })}
//                 </p>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="border-t border-border/20 dark:border-border/90 bg-background p-4">
//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSend();
//           }}
//           className="flex gap-2"
//         >
//           <Input
//             type="text"
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type a message..."
//             disabled={sending}
//             className="flex-1 px-4 py-2"
//             // className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//           />
//           <Button
//             type="submit"
//             disabled={!newMessage.trim() || sending}
//             // className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
//           >
//             {sending ? (
//               <div className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <Send className="w-5 h-5" />
//             )}
//           </Button>
//         </form>
//       </div>
//     </div>
//   );
// }
