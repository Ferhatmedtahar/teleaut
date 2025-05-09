import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return null;
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  return user;
}
