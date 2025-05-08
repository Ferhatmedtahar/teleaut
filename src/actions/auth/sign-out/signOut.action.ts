"use server";
import { cookies } from "next/headers";

export async function signOut() {
  const cookiesStore = await cookies();
  cookiesStore.delete("token");
  return true;
}
