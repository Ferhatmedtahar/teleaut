"use server";
import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { User } from "@/types/User";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;
  console.log("token", token);
  if (!token) return null;

  try {
    const decoded = await verifyToken(token);
    console.log("decoded from getCurrentUser", decoded);
    return decoded as User | null;
  } catch (err) {
    console.error(err);
    return null;
  }
}
