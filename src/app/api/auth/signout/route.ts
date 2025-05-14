import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect(
    new URL("/sign-in", process.env.NEXT_PUBLIC_SITE_URL)
  );

  response.cookies.set("token", "", {
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
