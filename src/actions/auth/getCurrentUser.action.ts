"use server";
import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { User } from "@/types/User";
import { cookies } from "next/headers";

export async function getCurrentUser(): Promise<{
  success: boolean;
  message: string;
  user?: User;
}> {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;
  if (!token) return { success: false, message: "Token not found" };

  try {
    const decoded = await verifyToken(token);
    return { success: true, message: "User found", user: decoded };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Invalid token" };
  }
}
