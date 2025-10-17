export type ChatType = "1-1" | "group_doctors" | "group_patients";

export interface Chat {
  id: string;
  type: ChatType;
  name: string | null;
  created_at: string;
  last_message_at: string | null;
  participants?: ChatParticipant[];
  lastMessage?: Message;
}

export interface ChatParticipant {
  id: string;
  chat_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    profile_url: string | null;
  };
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_by: string[];
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_url: string | null;
  };
}
