"use client";
import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { getOrCreateGroupChat } from "@/actions/chats/getGroupChat";
import { getUserChats } from "@/actions/chats/getUserChats";
import { createClient } from "@/lib/supabase/client";
import { Chat } from "@/types/entities/Chat.interface";
import { roles } from "@/types/roles.enum";
import Image from "next/image";
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
      router.push(`/messages/${chatId}`);
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
        <div className="text-gray-500 dark:text-secondary-400 text-xs lg:text-base">
          <span className="hidden lg:inline">Loading chats...</span>
          <span className="lg:hidden">...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {userRole !== "admin" && (
          <div className="p-2 lg:p-4 border-b border-border/20 dark:border-border/90">
            <h2 className="hidden lg:block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
              Group Chats
            </h2>
            {groupChats.length > 0 ? (
              <div className="space-y-1 lg:space-y-1">
                {groupChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => router.push(`/messages/${chat.id}`)}
                    className={`p-2 lg:p-3 rounded-lg cursor-pointer transition flex items-center justify-center lg:justify-start ${
                      activeChatId === chat.id
                        ? "bg-background border"
                        : "hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20"
                    }`}
                    title={chat.name!}
                  >
                    {/* Mobile: Icon only */}
                    <div className="lg:hidden w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    {/* Desktop: Full info */}
                    <div className="hidden lg:block">
                      <h3 className="font-medium text-sm">{chat.name}</h3>
                      <p className="text-xs text-gray-500">
                        {chat.type === "group_doctors"
                          ? "Doctors Group"
                          : "Patients Group"}
                      </p>
                    </div>
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
                className="w-full p-2 lg:p-3 border-2 border-dashed rounded-lg hover:bg-primary-600/10 transition text-xs text-gray-600 hover:cursor-pointer"
                title={`Join ${
                  userRole === "doctor" ? "Doctors" : "Patients"
                } Group`}
              >
                <span className="lg:hidden text-xl">+</span>
                <span className="hidden lg:inline">
                  + Join {userRole === "doctor" ? "Doctors" : "Patients"} Group
                </span>
              </button>
            )}
          </div>
        )}

        <div className="p-2">
          <h2 className="hidden lg:block px-2 text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase">
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
                    onClick={() => router.push(`/messages/${chat.id}`)}
                    className={`p-2 lg:p-3 rounded-lg cursor-pointer transition flex items-center justify-center lg:justify-start gap-0 lg:gap-3 hover:bg-secondary-400/40 dark:hover:bg-secondary-200/40 ${
                      activeChatId === chat.id &&
                      "bg-secondary-100 dark:bg-secondary-900"
                    }`}
                    title={getChatDisplayName(chat)}
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary-300 dark:bg-secondary-100 flex items-center justify-center flex-shrink-0">
                      {otherParticipant?.user?.profile_url ? (
                        <Image
                          width={40}
                          height={40}
                          src={
                            otherParticipant.user.profile_url ||
                            "/images/profile.png"
                          }
                          alt="profile image"
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-gray-600">
                          {otherParticipant?.user?.first_name?.[0]}
                        </span>
                      )}
                    </div>

                    {/* Desktop: Show full info */}
                    <div className="hidden lg:flex flex-1 min-w-0 items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {getChatDisplayName(chat)}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">
                          {otherParticipant?.user?.role}
                        </p>
                      </div>

                      {chat.last_message_at && (
                        <span className="text-xs text-gray-400 dark:text-gray-300 flex-shrink-0 ml-2">
                          {new Date(chat.last_message_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-xs">
              <p className="hidden lg:block">No messages yet</p>
              <p className="lg:hidden">-</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
