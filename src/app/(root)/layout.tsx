import { MobileSidebarDrawer } from "@/components/navigation/MobileSidebarDrawer";
import { Navbar } from "@/components/navigation/NavBar";
import AppSidebar from "@/components/navigation/Sidebar";

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <MobileSidebarDrawer />

      <div className="flex flex-grow overflow-hidden">
        <div className="hidden md:block md:flex-shrink-0">
          <AppSidebar className="h-[calc(100vh-4rem)]" />
        </div>

        <main className="flex-1 overflow-auto p-4 w-full">{children}</main>
      </div>
    </div>
  );
}
