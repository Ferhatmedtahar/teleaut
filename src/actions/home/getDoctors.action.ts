"use server";
import { createClient } from "@/lib/supabase/server";
import { Doctor } from "@/types/entities/Doctor.interface";
import { roles } from "@/types/roles.enum";

export async function getDoctorsList(): Promise<{
  success: boolean;
  message?: string;
  doctors?: Doctor[];
}> {
  const supabase = await createClient();

  const { data: doctors } = await supabase
    .from("users")
    .select("*")
    .eq("role", roles.doctor);

  if (!doctors) return { success: false, message: "doctors not found" };

  return { success: true, message: "doctors found", doctors };
}
