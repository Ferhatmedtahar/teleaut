export interface User {
  id: string
  username: string
  avatar?: string
}

export interface Chat {
  id: string
  name: string
  participants: string[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  isGroup?: boolean
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: string
  read: boolean
}
