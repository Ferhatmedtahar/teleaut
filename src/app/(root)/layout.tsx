import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
import { MobileSidebarDrawer } from "@/components/navigation/MobileSidebarDrawer";
import { Navbar } from "@/components/navigation/NavBar";
import AppSidebar from "@/components/navigation/Sidebar";
import { UserProvider } from "@/providers/UserProvider";
import AuthGuard from "../(auth)/_components/AuthGuardRouter";

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  console.log("layout user", user);
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <UserProvider user={user}>
        <Navbar />

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
