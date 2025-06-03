import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  // if (!token) {
  //   return NextResponse.redirect(new URL("/sign-in", request.url));
  // }

  // if (
  //   request.nextUrl.pathname.startsWith("/sign-in") ||
  //   request.nextUrl.pathname.startsWith("/sign-up")
  // ) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }
  // sign-in(?:/reset-password)?|sign-up(?:/.*)?
  const pathname = request.nextUrl.pathname;
  const isAuthPage =
    pathname.startsWith("/sign-in") ||
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // console.log("isAuthPage", isAuthPage);
  // console.log("url", request.url);
  // console.log("token", token);
  // If user is authenticated and tries to access auth pages -> redirect to /
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is NOT authenticated and tries to access protected pages -> redirect to /sign-in
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons/*|images/*).*)",
  ],
};

//implmentation of middleware to allow users to access auth pages and home page only.
// import { cookies } from "next/headers";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("token");

//   const pathname = request.nextUrl.pathname;

//   // Define auth pages
//   const isAuthPage =
//     pathname.startsWith("/sign-in") ||
//     pathname.startsWith("/sign-up") ||
//     pathname.startsWith("/forgot-password") ||
//     pathname.startsWith("/reset-password");

//   // Define home page
//   const isHomePage = pathname === "/";

//   // If user is authenticated and tries to access auth pages -> redirect to home
//   if (token && isAuthPage) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // If user is NOT authenticated:
//   if (!token) {
//     // Allow access to auth pages and home page only
//     if (isAuthPage || isHomePage) {
//       return NextResponse.next();
//     }
//     // Redirect to sign-in for all other pages
//     return NextResponse.redirect(new URL("/sign-in", request.url));
//   }

//   // If user is authenticated, allow access to all pages
//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|icons/*|images/*).*)",
//   ],
// };
