import React from "react";
import UserChatsSidebar from "./_components/UserChatsSidebar";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex max-h-screen h-full bg-background">
      <div className="w-80 border-r border-border/20 dark:border-border/90   ">
        <UserChatsSidebar />
      </div>

      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

export default layout;
