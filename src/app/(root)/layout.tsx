// import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
// import {
//   MobileSidebarDrawer,
//   MobileSidebarProvider,
// } from "@/components/navigation/MobileSidebarDrawer";
// import NavbarWithMobileSidebar from "@/components/navigation/NavBarMobileSideBar";
// import AppSidebar from "@/components/navigation/Sidebar";
// import { createClient } from "@/lib/supabase/server";
// import { UserProvider } from "@/providers/UserProvider";
// import { redirect } from "next/navigation";
// import AuthGuard from "../(auth)/_components/AuthGuardRouter";

// export default async function RootLayout({
//   children,
// }: {
//   readonly children: React.ReactNode;
// }) {
//   const baseurl = process.env.NEXT_PUBLIC_SITE_URL!;
//   const result = await getCurrentUser();
//   if (!result.success || !result.user) return null;

//   const { user } = result;
//   const supabase = await createClient();
//   const { data: userInfo } = await supabase
//     .from("users")
//     .select("first_name ,profile_url,verification_status")
//     .eq("id", user?.id)
//     .single();

//   // if (userInfo?.verification_status !== "approved") return redirect("/sign-in");

//   if (!userInfo) {
//     return redirect(`${baseurl}/api/auth/signout`);
//   }

//   return (
//     <div className="flex min-h-screen flex-col bg-background selection:bg-yellow-100 selection:text-[#355869]">
//       <UserProvider user={user}>
//         <MobileSidebarProvider>
//           <NavbarWithMobileSidebar userInfo={userInfo} />

//           <MobileSidebarDrawer />

//           {/* Layout container */}
//           <div className="flex flex-grow h-[calc(100vh-4rem)]">
//             <div className="hidden md:block md:flex-shrink-0">
//               <AppSidebar className="h-full" />
//             </div>

//             <main className="flex-1 overflow-auto sm:border-l border-border/20 dark:border-border/90">
//               <AuthGuard />
//               {children}
//             </main>
//           </div>
//         </MobileSidebarProvider>
//       </UserProvider>
//     </div>
//   );
// }
// app/(root)/layout.tsx
import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import {
  MobileSidebarDrawer,
  MobileSidebarProvider,
} from "@/components/navigation/MobileSidebarDrawer";
import NavbarWithMobileSidebar from "@/components/navigation/NavBarMobileSideBar";
import AppSidebar from "@/components/navigation/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/providers/UserProvider";
import { redirect } from "next/navigation";
import AuthGuard from "../(auth)/_components/AuthGuardRouter";
import GuestNavbar from "@/components/navigation/GuestNavBar";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const baseurl = process.env.NEXT_PUBLIC_SITE_URL!;
  const result = await getCurrentUser();

  // Guest user - no authentication required
  if (!result.success || !result.user) {
    return (
      <div className="flex min-h-screen flex-col bg-background selection:bg-yellow-100 selection:text-[#355869]">
        <UserProvider user={null}>
          <GuestNavbar />
          <main className="flex-1 overflow-auto">{children}</main>
        </UserProvider>
      </div>
    );
  }

  // Authenticated user flow
  const { user } = result;
  const supabase = await createClient();
  const { data: userInfo } = await supabase
    .from("users")
    .select("first_name ,profile_url,verification_status")
    .eq("id", user?.id)
    .single();

  if (!userInfo) {
    return redirect(`${baseurl}/api/auth/signout`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-yellow-100 selection:text-[#355869]">
      <UserProvider user={user}>
        <MobileSidebarProvider>
          <NavbarWithMobileSidebar userInfo={userInfo} />
          <MobileSidebarDrawer />

          {/* Layout container */}
          <div className="flex flex-grow h-[calc(100vh-4rem)]">
            <div className="hidden md:block md:flex-shrink-0">
              <AppSidebar className="h-full" />
            </div>

            <main className="flex-1 overflow-auto sm:border-l border-border/20 dark:border-border/90">
              <AuthGuard />
              {children}
            </main>
          </div>
        </MobileSidebarProvider>
      </UserProvider>
    </div>
  );
}
