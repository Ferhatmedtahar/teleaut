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
      return { success: false, message: "L'e-mail est déjà enregistré." };
    }
    return {
      success: true,
      message: "Le courrier électronique est disponible.",
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Une erreur inattendue s'est produite." };
  }
}
