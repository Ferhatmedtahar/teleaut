"use client";

import { MessageSquare, Search, Users } from "lucide-react";

export default function ChatsPage() {
  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="text-center max-w-md px-6">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-200 rounded-full flex items-center justify-center">
            <MessageSquare className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Select a chat to start messaging
        </h2>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Choose from your existing conversations or start a new chat with a
          doctor or patient.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 gap-4 text-left ">
          <div className="bg-backgorund hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 transition-colors duration-200 p-4 rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Group Chats</h3>
                <p className="text-xs text-gray-600">
                  Join group conversations with other doctors or patients to
                  share knowledge and experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-backgorund hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 transition-colors duration-200  p-4 rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Direct Messages</h3>
                <p className="text-xs text-gray-600">
                  Have private conversations with doctors or patients. Visit
                  their profile to start chatting.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-backgorund p-4  hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 transition-colors duration-200 rounded-lg shadow-sm border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-50 dark:bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1">Find Users</h3>
                <p className="text-xs text-gray-600">
                  Browse through doctor or patient profiles to find the right
                  person to connect with.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// "use client";

// import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
// import { getOrCreateGroupChat } from "@/actions/chats/getGroupChat";
// import { getUserChats } from "@/actions/chats/getUserChats";
// import { createClient } from "@/lib/supabase/client";
// import { Chat } from "@/types/entities/Chat.interface";
// import { roles } from "@/types/roles.enum";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function ChatsPage() {
//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userRole, setUserRole] = useState<string>("");
//   const [currentUserId, setCurrentUserId] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     loadChats();
//   }, []);

//   async function loadChats() {
//     const supabase = createClient();
//     const { user } = await getCurrentUser();

//     if (!user) {
//       router.push("/sign-in");
//       return;
//     }

//     setCurrentUserId(user.id);
//     const { data: userData } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (userData) {
//       setUserRole(userData.role);
//     }

//     const { data, error } = await getUserChats(user.id);
//     if (data) setChats(data);
//     setLoading(false);
//   }

//   async function handleJoinGroupChat(type: "group_doctors" | "group_patients") {
//     const { chatId } = await getOrCreateGroupChat(type, currentUserId);
//     if (chatId) {
//       router.push(`/chats/${chatId}`);
//     }
//   }

//   // Filter chats based on user role
//   const oneOnOneChats = chats.filter((chat) => chat.type === "1-1");
//   const groupChats = chats.filter((chat) => {
//     if (chat.type === "group_doctors") return userRole === roles.doctor;
//     if (chat.type === "group_patients") return userRole === roles.patient;
//     return false;
//   });

//   function getChatDisplayName(chat: Chat) {
//     if (chat.name) return chat.name;

//     // For 1-1 chats, show the other person's name
//     const otherParticipant = chat.participants?.find(
//       (p: any) => p.user_id !== currentUserId
//     );
//     if (otherParticipant?.user) {
//       return `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`;
//     }

//     return "Unknown";
//   }

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Chats</h1>

//       {/* Group Chats Section */}
//       {userRole !== "admin" && (
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-3">Group Chats</h2>
//           <div className="space-y-2">
//             {groupChats.length > 0 ? (
//               groupChats.map((chat) => (
//                 <div
//                   key={chat.id}
//                   onClick={() => router.push(`/chats/${chat.id}`)}
//                   className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
//                 >
//                   <h3 className="font-semibold">{chat.name}</h3>
//                   <p className="text-sm text-gray-500">
//                     {chat.type === "group_doctors"
//                       ? "Doctors Group"
//                       : "Patients Group"}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <button
//                 onClick={() =>
//                   handleJoinGroupChat(
//                     userRole === "doctor" ? "group_doctors" : "group_patients"
//                   )
//                 }
//                 className="w-full p-4 border-2 border-dashed rounded-lg hover:bg-gray-50 transition text-gray-600"
//               >
//                 Join {userRole === "doctor" ? "Doctors" : "Patients"} Group Chat
//               </button>
//             )}
//           </div>
//         </div>
//       )}

//       {/* 1-1 Chats Section */}
//       <div>
//         <h2 className="text-xl font-semibold mb-3">Direct Messages</h2>
//         {oneOnOneChats.length > 0 ? (
//           <div className="space-y-2">
//             {oneOnOneChats.map((chat) => {
//               const otherParticipant = chat.participants?.find(
//                 (p: any) => p.user_id !== currentUserId
//               );

//               return (
//                 <div
//                   key={chat.id}
//                   onClick={() => router.push(`/chats/${chat.id}`)}
//                   className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition flex items-center gap-3"
//                 >
//                   {/* Profile Picture */}
//                   <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
//                     {otherParticipant?.user?.profile_url ? (
//                       <img
//                         src={otherParticipant.user.profile_url}
//                         alt=""
//                         className="w-full h-full rounded-full object-cover"
//                       />
//                     ) : (
//                       <span className="text-lg font-semibold text-gray-600">
//                         {otherParticipant?.user?.first_name?.[0]}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="font-semibold">
//                       {getChatDisplayName(chat)}
//                     </h3>
//                     <p className="text-sm text-gray-500 capitalize">
//                       {otherParticipant?.user?.role}
//                     </p>
//                   </div>

//                   {chat.last_message_at && (
//                     <span className="text-xs text-gray-400">
//                       {new Date(chat.last_message_at).toLocaleDateString()}
//                     </span>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-8 text-gray-500">
//             <p>No direct messages yet</p>
//             <p className="text-sm mt-2">
//               Visit a {userRole === "doctor" ? "patient" : "doctor"}'s profile
//               to start chatting
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// // import React from "react";

// // function page() {
// //   return <div>page</div>;
// // }

// // export default page;
