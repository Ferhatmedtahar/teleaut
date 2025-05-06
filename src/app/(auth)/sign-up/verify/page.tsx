import { verifyToken } from "@/lib/helpers/verifyToken"; // helper to decode/validate token
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function VerifyPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams; // Correctly awaiting searchParams

  if (!token) {
    return redirect("/sign-up/fail-auth");
  }

  console.log(token);

  let updateSuccessful = false;

  try {
    const payload = await verifyToken(token);
    const supabase = await createClient();
    console.log(payload);

    const { error } = await supabase
      .from("users")
      .update({ is_verified: true })
      .eq("id", payload.userId);

    if (error) {
      console.error("Supabase update failed:", error);
      throw new Error("Update failed");
    }

    updateSuccessful = true;
  } catch (err) {
    console.error("Verification or update failed:", err);
  }

  if (updateSuccessful) {
    redirect("/");
  } else {
    redirect("/sign-up/fail-auth");
  }
}
