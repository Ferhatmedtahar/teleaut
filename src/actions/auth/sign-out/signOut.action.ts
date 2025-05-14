"use server";
import { cookies } from "next/headers";
export async function signOut() {
  const cookiesStore = await cookies();
  cookiesStore.delete("token");
  // cookiesStore.set("token", "", {
  //   expires: new Date(0),
  // });
  return true;
}
