"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userId: string | null;
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  userId: null,
  token: null,
  setToken: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setTokenState(storedToken);
      try {
        const decoded = jwtDecode(storedToken);

        setUserId(decoded?.userId);

        // Check if user is admin (if role is stored in token)
        setIsAdmin(decoded?.role === "admin");

        // If role is not in token, you might need to fetch user data here
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authToken");
      }
    }
    setIsLoading(false);
  }, []);

  const setToken = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);

    try {
      const decoded = jwtDecode(newToken);
      setUserId(decoded.sub || decoded.user_id || decoded.userId);
      setIsAdmin(decoded.role === "admin");
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setTokenState(null);
    setUserId(null);
    setIsAdmin(false);
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        isAdmin,
        userId,
        token,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
