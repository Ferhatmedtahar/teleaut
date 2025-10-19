"use client";

import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getOrCreateGroupChat } from "@/actions/chats/getGroupChat";
import { getUserChats } from "@/actions/chats/getUserChats";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/entities/Chat.interface";
import { roles } from "@/types/roles.enum";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserChatsSidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState("");
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.chatId as string | undefined;

  useEffect(() => {
    loadChats();
  }, []);

  async function loadChats() {
    const supabase = createClient();
    const { user } = await getCurrentUser();

    if (!user) {
      router.push("/sign-in");
      return;
    }

    setCurrentUserId(user.id);
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData) {
      setUserRole(userData.role);
    }

    const { data, error } = await getUserChats(user.id);
    if (data) setChats(data);
    setLoading(false);
  }

  async function handleJoinGroupChat(type: "group_doctors" | "group_patients") {
    const { chatId } = await getOrCreateGroupChat(type, currentUserId);
    if (chatId) {
      router.push(`/chats/${chatId}`);
    }
  }

  const oneOnOneChats = chats.filter((chat) => chat.type === "1-1");
  const groupChats = chats.filter((chat) => {
    if (chat.type === "group_doctors") return userRole === roles.doctor;
    if (chat.type === "group_patients") return userRole === roles.patient;
    return false;
  });

  function getChatDisplayName(chat: Chat) {
    if (chat.name) return chat.name;

    const otherParticipant = chat.participants?.find(
      (p: any) => p.user_id !== currentUserId
    );
    if (otherParticipant?.user) {
      return `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`;
    }

    return "Unknown";
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-gray-500">Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border/20 dark:border-border/90">
        <h1 className="text-xl font-bold">Messages</h1>
      </div>{" "}
      <div className="flex-1 overflow-y-auto">
        {userRole !== "admin" && (
          <div className="p-4 border-b border-border/20 dark:border-border/90">
            <h2 className="text-sm font-semibold text-gray-600  dark:text-gray-400 mb-2 uppercase">
              Group Chats
            </h2>
            {groupChats.length > 0 ? (
              <div className="space-y-1">
                {groupChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/chats/${chat.id}`)}
                    className={`p-3 rounded-lg cursor-pointer transition ${
                      activeChatId === chat.id
                        ? "bg-background border "
                        : "hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 "
                    }`}
                  >
                    <h3 className="font-medium text-sm">{chat.name}</h3>
                    <p className="text-xs text-gray-500">
                      {chat.type === "group_doctors"
                        ? "Doctors Group"
                        : "Patients Group"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <button
                onClick={() =>
                  handleJoinGroupChat(
                    userRole === "doctor" ? "group_doctors" : "group_patients"
                  )
                }
                className="w-full p-3 border-2 border-dashed rounded-lg hover:bg-primary-600/10 transition text-xs text-gray-600 hover:cursor-pointer"
              >
                + Join {userRole === "doctor" ? "Doctors" : "Patients"} Group
              </button>
            )}
          </div>
        )}

        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
            Direct Messages
          </h2>
          {oneOnOneChats.length > 0 ? (
            <div className="space-y-1">
              {oneOnOneChats.map((chat) => {
                const otherParticipant = chat.participants?.find(
                  (p: any) => p.user_id !== currentUserId
                );

                return (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/chats/${chat.id}`)}
                    className={`p-3 rounded-lg cursor-pointer transition flex items-center gap-3 ${
                      activeChatId === chat.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {/* Profile Picture */}
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                      {otherParticipant?.user?.profile_url ? (
                        <img
                          src={otherParticipant.user.profile_url}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">
                          {otherParticipant?.user?.first_name?.[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {getChatDisplayName(chat)}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {otherParticipant?.user?.role}
                      </p>
                    </div>

                    {chat.last_message_at && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(chat.last_message_at).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-xs">
              <p>No messages yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
// import React from "react";

// function UserChatsSidebar() {
//   return <div>UserChatsSidebar</div>;
// }

// export default UserChatsSidebar;
