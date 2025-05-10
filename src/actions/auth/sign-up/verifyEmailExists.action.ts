"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export async function verifyEmailExists(email: string) {
  try {
    const supabase = await createClient();
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();
    if (existingUser) {
      return { success: false, message: "Email is already registered." };
    }
    return { success: true, message: "Email is available." };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}
