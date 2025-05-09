import { verifyToken } from "@/app/(auth)/_lib/verifyToken";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/sign-up/fail-auth", req.url));
  }

  try {
    const payload = await verifyToken(token);
    const supabase = await createClient();

    const { error } = await supabase
      .from("users")
      .update({ verification_status: VERIFICATION_STATUS.APPROVED })
      .eq("id", payload.id);

    if (error) throw error;

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return NextResponse.redirect(new URL("/", req.url));
  } catch (error) {
    console.error("Verification failed", error);
    return NextResponse.redirect(new URL("/sign-up/fail-auth", req.url));
  }
}
