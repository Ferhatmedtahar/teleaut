import type React from "react";
import { Sidebar } from "./_components/sidebar";
import { ChatProvider } from "./_context/chat-context";
import { AuthProvider } from "./_context/auth-context";

export default function ChatsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ChatProvider>
        <div className="flex h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </ChatProvider>
    </AuthProvider>
  );
}
