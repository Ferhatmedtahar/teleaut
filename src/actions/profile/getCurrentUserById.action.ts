"use server";

import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function getCurrentUserById() {
  const cookiesStore = await cookies();

  const token = cookiesStore.get("token")?.value;
  if (!token) return { success: false, message: "Token not found" };
  const payload = await verifyToken(token);
  const supabase = await createClient();

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", payload.id)
    .single();

  if (!user) return { success: false, message: "User not found" };

  return { success: true, message: "User found", user };
}
