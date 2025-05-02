import { Users } from "lucide-react";
import type { Chat } from "../_lib/types";
import { Avatar } from "./ui/avatar";

interface ChatHeaderProps {
  chat: Chat;
}

export function ChatHeader({ chat }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-3 border-b bg-background/80">
      <div className="flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <div className="bg-gray-200 h-full w-full flex items-center justify-center">
            {chat.isGroup ? (
              <Users className="h-5 w-5 text-gray-500" />
            ) : (
              chat.name.charAt(0).toUpperCase()
            )}
          </div>
        </Avatar>
        <div>
          <h2 className="font-semibold">{chat.name}</h2>
          <p className="text-xs text-gray-500">
            {chat.isGroup
              ? `${chat.participants.length} participants`
              : chat.isOnline
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      {/* <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" title="Voice Call">
          <Phone className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="Video Call">
          <Video className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" title="More Options">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div> */}
    </div>
  );
}
