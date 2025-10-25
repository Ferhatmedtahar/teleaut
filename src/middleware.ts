//implmentation of middleware to allow users to access auth pages and home page only.
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  const isHomePage = pathname === "/";

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!token) {
    if (isAuthPage || isHomePage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons/*|images/*).*)",
  ],
};
