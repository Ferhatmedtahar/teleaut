"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createNewChat,
  getChatMessages,
  getChats,
  getUsers,
} from "../_lib/chat";
import type { Chat, Message } from "../_lib/types";

interface ChatContextType {
  chats: Chat[];
  messages: Record<string, Message[]>;
  loadMessages: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, content: string, senderId: string) => void;
  createChat: () => void;
  createGroupChat: (name: string, participants: string[]) => void;
  users: Array<{ id: string; username: string; avatar: string }>;
  loadUsers: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [users, setUsers] = useState<
    Array<{ id: string; username: string; avatar: string }>
  >([]);

  useEffect(() => {
    const loadChats = async () => {
      const fetchedChats = await getChats();
      setChats(fetchedChats);
    };

    loadChats();
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const fetchedUsers = await getUsers();
    setUsers(fetchedUsers);
  };

  const loadMessages = async (chatId: string) => {
    const chatMessages = await getChatMessages(chatId);
    setMessages((prev) => ({
      ...prev,
      [chatId]: chatMessages,
    }));
  };

  const sendMessage = (chatId: string, content: string, senderId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      chatId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Update messages
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMessage],
    }));

    // Update chat last message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              lastMessage: content,
              lastMessageTime: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            }
          : chat
      )
    );

    // In a real app, we would send this to the server
    // For now, we'll simulate a response after a delay
    setTimeout(() => {
      // Only simulate response for non-group chats
      const currentChat = chats.find((chat) => chat.id === chatId);
      if (!currentChat?.isGroup) {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          chatId,
          senderId: chatId, // Using chatId as the sender ID for the response
          content: `Reply to: ${content}`,
          timestamp: new Date().toISOString(),
          read: true,
        };

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), responseMessage],
        }));
      }
    }, 1000);
  };

  const createChat = () => {
    const newChat = createNewChat();
    setChats((prev) => [newChat, ...prev]);
  };

  const createGroupChat = (name: string, participants: string[]) => {
    if (participants.length < 2) {
      throw new Error(
        "Group chats require at least 3 participants (including you)"
      );
    }

    const newChat = createNewChat(true, participants, name);
    setChats((prev) => [newChat, ...prev]);

    // Initialize empty message array for this chat
    setMessages((prev) => ({
      ...prev,
      [newChat.id]: [],
    }));

    return newChat.id;
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        messages,
        loadMessages,
        sendMessage,
        createChat,
        createGroupChat,
        users,
        loadUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
