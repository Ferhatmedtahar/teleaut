"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useChat } from "../_context/chat-context";
// import { useAuth } from "../_context/auth-context";
import { Button } from "@/components/common/buttons/Button";
import { cn } from "@/lib/utils";
import { Search, Settings, UserIcon, Users } from "lucide-react";
import { CreateGroupModal } from "../_components/create-group-modal";
import { Avatar } from "../_components/ui/avatar";
import { Input } from "../_components/ui/input";
import { User } from "../_lib/types";

export function Sidebar() {
  const pathname = usePathname();
  const { chats, createChat } = useChat();
  // const { user, logout } = useAuth();
  const user: User = { id: "user1", username: "testUser" }; // Mock user for demonstration
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 border-r flex flex-col h-full bg-background/80">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar>
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <UserIcon className="h-6 w-6 text-gray-500" />
            </div>
          </Avatar>
          <div>
            <h2 className="font-semibold">{user.username || "User"}</h2>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button variant="ghost" size="icon" onClick={logout} title="Logout">
            <LogOut className="h-5 w-5" />
          </Button> */}
          <Button variant="ghost" size="icon" title="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="p-3 border-b">
        <div className="relative ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search chats"
            className="pl-8  bg-background/50 text-foreground "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length > 0 ? (
          <div className="divide-y">
            {filteredChats.map((chat) => {
              const isActive = pathname === `/chats/${chat.id}`;
              return (
                <Link key={chat.id} href={`/chats/${chat.id}`}>
                  <div
                    className={cn(
                      "flex items-center p-3 hover:bg-primary-200 cursor-pointer",
                      isActive && "bg-primary-500"
                    )}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      <div className="bg-primary-300 dark:bg-primary-100 h-full w-full flex items-center justify-center">
                        {chat.isGroup ? (
                          <Users className="h-5 w-5 text-gray-500" />
                        ) : (
                          chat.name.charAt(0).toUpperCase()
                        )}
                      </div>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium truncate">{chat.name}</h3>
                        <span className="text-xs text-gray-500">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">No chats found</div>
        )}
      </div>
      <div className="p-3 border-t flex space-x-2">
        <Button
          className="flex-1 flex items-center justify-center"
          onClick={() => setIsGroupModalOpen(true)}
        >
          <Users className="h-4 w-4 mr-2" />
          New Group
        </Button>
      </div>

      <CreateGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
      />
    </div>
  );
}
