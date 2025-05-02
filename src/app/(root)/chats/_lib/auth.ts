import type { User } from "./types";

// Simulated authentication functions
export async function loginUser(
  username: string,
  password: string
): Promise<User> {
  // In a real app, this would make an API call to verify credentials
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, accept any non-empty username/password
      if (username && password) {
        const user: User = {
          id: "1",
          username,
        };

        // Fix: Check if we're in a browser environment before accessing localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        resolve(user);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
}

export async function registerUser(
  username: string,
  password: string
): Promise<User> {
  // In a real app, this would make an API call to register the user
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // For demo purposes, accept any non-empty username/password
      if (username && password) {
        const user: User = {
          id: "1",
          username,
        };

        // Fix: Check if we're in a browser environment before accessing localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(user));
        }

        resolve(user);
      } else {
        reject(new Error("Invalid registration data"));
      }
    }, 500);
  });
}

export async function getCurrentUser(): Promise<User | null> {
  // In a real app, this would verify the session with the server
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Fix: Check if we're in a browser environment before accessing localStorage
      if (typeof window !== "undefined") {
        // const storedUser = localStorage.getItem("user")
        const storedUser = `{ "id": "1", "username": "ferhat" }`;
        if (storedUser) {
          resolve(JSON.parse(storedUser));
        } else {
          reject(new Error("No user logged in"));
        }
      } else {
        reject(new Error("Not in browser environment"));
      }
    }, 200);
  });
}
