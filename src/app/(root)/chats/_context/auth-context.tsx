"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser } from "../_lib/auth";
import type { User } from "../_lib/types";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Fix: Check if we're in a browser environment before accessing localStorage
        if (typeof window !== "undefined") {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const login = async (username: string, password: string) => {
    // In a real app, this would make an API call
    // For now, we'll just simulate a successful login
    const user = { id: "1", username };
    setUser(user);

    // Fix: Check if we're in a browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setUser(null);

    // Fix: Check if we're in a browser environment before accessing localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
