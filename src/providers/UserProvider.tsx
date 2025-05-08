// providers/UserProvider.tsx
"use client";

import { User } from "@/types/User";
import { createContext, useContext, useState } from "react";

const UserContext = createContext<User | null>(null);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({
  children,
  user,
}: {
  readonly children: React.ReactNode;
  readonly user: User | null;
}) {
  const [currentUser, setCurrentUser] = useState(user);
  console.log("current user", currentUser);

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
}
