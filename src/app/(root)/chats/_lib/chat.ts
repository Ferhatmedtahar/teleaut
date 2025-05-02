import type { Chat, Message } from "./types"

// Dummy data for chats
const dummyChats: Chat[] = [
  {
    id: "1",
    name: "John Doe",
    participants: ["1", "2"],
    lastMessage: "Hey, how are you doing?",
    lastMessageTime: "10:30 AM",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    participants: ["1", "3"],
    lastMessage: "Can we meet tomorrow?",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "3",
    name: "Work Group",
    participants: ["1", "2", "3", "4"],
    lastMessage: "Meeting at 3 PM",
    lastMessageTime: "Yesterday",
    unreadCount: 5,
    isOnline: true,
  },
  {
    id: "4",
    name: "Alice Johnson",
    participants: ["1", "5"],
    lastMessage: "Thanks for the help!",
    lastMessageTime: "Monday",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: "5",
    name: "Bob Williams",
    participants: ["1", "6"],
    lastMessage: "Let's catch up soon",
    lastMessageTime: "Sunday",
    unreadCount: 0,
    isOnline: true,
  },
]

// Dummy data for messages
const dummyMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "101",
      chatId: "1",
      senderId: "2",
      content: "Hey there!",
      timestamp: "2023-04-23T08:30:00Z",
      read: true,
    },
    {
      id: "102",
      chatId: "1",
      senderId: "1",
      content: "Hi! How are you?",
      timestamp: "2023-04-23T08:32:00Z",
      read: true,
    },
    {
      id: "103",
      chatId: "1",
      senderId: "2",
      content: "I'm good, thanks! How about you?",
      timestamp: "2023-04-23T08:33:00Z",
      read: true,
    },
    {
      id: "104",
      chatId: "1",
      senderId: "1",
      content: "Doing well. Just working on a new project.",
      timestamp: "2023-04-23T08:35:00Z",
      read: true,
    },
    {
      id: "105",
      chatId: "1",
      senderId: "2",
      content: "That sounds interesting! What kind of project?",
      timestamp: "2023-04-23T08:37:00Z",
      read: true,
    },
    {
      id: "106",
      chatId: "1",
      senderId: "1",
      content: "It's a chat application, similar to WhatsApp.",
      timestamp: "2023-04-23T08:40:00Z",
      read: true,
    },
    {
      id: "107",
      chatId: "1",
      senderId: "2",
      content: "Cool! Let me know if you need any help with testing.",
      timestamp: "2023-04-23T08:42:00Z",
      read: true,
    },
    {
      id: "108",
      chatId: "1",
      senderId: "2",
      content: "Hey, how are you doing?",
      timestamp: "2023-04-23T10:30:00Z",
      read: false,
    },
  ],
  "2": [
    {
      id: "201",
      chatId: "2",
      senderId: "3",
      content: "Hi there!",
      timestamp: "2023-04-22T14:20:00Z",
      read: true,
    },
    {
      id: "202",
      chatId: "2",
      senderId: "1",
      content: "Hello! How's your day going?",
      timestamp: "2023-04-22T14:22:00Z",
      read: true,
    },
    {
      id: "203",
      chatId: "2",
      senderId: "3",
      content: "Pretty busy, but good. Can we meet tomorrow to discuss the project?",
      timestamp: "2023-04-22T14:25:00Z",
      read: true,
    },
    {
      id: "204",
      chatId: "2",
      senderId: "1",
      content: "Sure, what time works for you?",
      timestamp: "2023-04-22T14:27:00Z",
      read: true,
    },
    {
      id: "205",
      chatId: "2",
      senderId: "3",
      content: "How about 2 PM at the coffee shop?",
      timestamp: "2023-04-22T14:30:00Z",
      read: true,
    },
    {
      id: "206",
      chatId: "2",
      senderId: "1",
      content: "Sounds good. See you then!",
      timestamp: "2023-04-22T14:32:00Z",
      read: true,
    },
    {
      id: "207",
      chatId: "2",
      senderId: "3",
      content: "Can we meet tomorrow?",
      timestamp: "2023-04-22T18:45:00Z",
      read: true,
    },
  ],
  "3": [
    {
      id: "301",
      chatId: "3",
      senderId: "4",
      content: "Hello team!",
      timestamp: "2023-04-22T09:00:00Z",
      read: true,
    },
    {
      id: "302",
      chatId: "3",
      senderId: "2",
      content: "Good morning everyone!",
      timestamp: "2023-04-22T09:02:00Z",
      read: true,
    },
    {
      id: "303",
      chatId: "3",
      senderId: "3",
      content: "Hi all, hope everyone had a good weekend.",
      timestamp: "2023-04-22T09:05:00Z",
      read: true,
    },
    {
      id: "304",
      chatId: "3",
      senderId: "4",
      content: "Just a reminder that we have a meeting at 3 PM today.",
      timestamp: "2023-04-22T09:10:00Z",
      read: true,
    },
    {
      id: "305",
      chatId: "3",
      senderId: "1",
      content: "Thanks for the reminder. Will it be in the conference room?",
      timestamp: "2023-04-22T09:12:00Z",
      read: true,
    },
    {
      id: "306",
      chatId: "3",
      senderId: "4",
      content: "Yes, conference room A.",
      timestamp: "2023-04-22T09:15:00Z",
      read: true,
    },
    {
      id: "307",
      chatId: "3",
      senderId: "2",
      content: "I'll prepare the slides for the presentation.",
      timestamp: "2023-04-22T09:20:00Z",
      read: true,
    },
    {
      id: "308",
      chatId: "3",
      senderId: "4",
      content: "Meeting at 3 PM",
      timestamp: "2023-04-22T15:00:00Z",
      read: false,
    },
  ],
}

// Simulated API functions
export async function getChats(): Promise<Chat[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyChats)
    }, 500)
  })
}

export async function getChatById(chatId: string): Promise<Chat | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const chat = dummyChats.find((c) => c.id === chatId)
      resolve(chat)
    }, 300)
  })
}

export async function getChatMessages(chatId: string): Promise<Message[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyMessages[chatId] || [])
    }, 500)
  })
}

// Update the createNewChat function to support group creation
export function createNewChat(isGroup = false, participants = ["1"], name = ""): Chat {
  const id = Date.now().toString()

  // For regular chats
  if (!isGroup) {
    return {
      id,
      name: `New Chat ${id.slice(-4)}`,
      participants: ["1", id],
      lastMessage: "Start a conversation",
      lastMessageTime: "Just now",
      unreadCount: 0,
      isOnline: true,
      isGroup: false,
    }
  }

  // For group chats
  return {
    id,
    name: name || `Group ${id.slice(-4)}`,
    participants: ["1", ...participants],
    lastMessage: "Group created",
    lastMessageTime: "Just now",
    unreadCount: 0,
    isOnline: true,
    isGroup: true,
  }
}

// Add more dummy users for group creation
export const dummyUsers = [
  { id: "2", username: "John Doe", avatar: "J" },
  { id: "3", username: "Jane Smith", avatar: "J" },
  { id: "4", username: "Alice Johnson", avatar: "A" },
  { id: "5", username: "Bob Williams", avatar: "B" },
  { id: "6", username: "Carol Davis", avatar: "C" },
  { id: "7", username: "Dave Wilson", avatar: "D" },
  { id: "8", username: "Eve Brown", avatar: "E" },
  { id: "9", username: "Frank Miller", avatar: "F" },
]

// Function to get all users
export async function getUsers(): Promise<{ id: string; username: string; avatar: string }[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyUsers)
    }, 300)
  })
}
