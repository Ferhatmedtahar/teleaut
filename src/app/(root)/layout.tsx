import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { MobileSidebarDrawer } from "@/components/navigation/MobileSidebarDrawer";
import { Navbar } from "@/components/navigation/NavBar";
import AppSidebar from "@/components/navigation/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { UserProvider } from "@/providers/UserProvider";
import AuthGuard from "../(auth)/_components/AuthGuardRouter";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const supabase = await createClient();
  const { data: userInfo } = await supabase
    .from("users")
    .select("first_name ,profile_url ")
    .eq("id", user?.id)
    .single();
  if (!user) return null;
  if (
    typeof userInfo?.first_name !== "string" ||
    typeof userInfo?.profile_url !== "string"
  )
    return null;
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <UserProvider user={user}>
        <Navbar userInfo={userInfo} />

        <MobileSidebarDrawer />

        <div className="flex flex-grow overflow-hidden">
          <div className="hidden md:block md:flex-shrink-0">
            <AppSidebar className="h-[calc(100vh-4rem)]" />
          </div>

          <main className="flex-1 overflow-auto p-4 w-full">
            <AuthGuard />
            {children}
          </main>
        </div>
      </UserProvider>
    </div>
  );
}
