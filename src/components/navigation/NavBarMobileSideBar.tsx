"use client";
import { useMobileSidebar } from "./MobileSidebarDrawer";
import { Navbar } from "./NavBar";

export default function NavbarWithMobileSidebar({
  userInfo,
}: {
  userInfo: any;
}) {
  const { toggle } = useMobileSidebar();

  return (
    <Navbar
      userInfo={{
        first_name: userInfo.first_name,
        profile_url: userInfo.profile_url,
      }}
      onMenuToggle={toggle}
    />
  );
}
