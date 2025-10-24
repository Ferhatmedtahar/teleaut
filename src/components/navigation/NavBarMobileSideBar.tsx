// "use client";
// import { useMobileSidebar } from "./MobileSidebarDrawer";
// import { Navbar } from "./NavBar";

// export default function NavbarWithMobileSidebar({
//   userInfo,
// }: {
//   userInfo: any;
// }) {
//   const { toggle } = useMobileSidebar();

// return (
//   <Navbar
//     userInfo={{
//       first_name: userInfo.first_name,
//       profile_url: userInfo.profile_url,
//     }}
//     onMenuToggle={toggle}
//   />
// );
// }
"use client";
import React from "react";
import { useMobileSidebar } from "./MobileSidebarDrawer";
import { Navbar } from "./NavBar";

interface UserInfo {
  first_name: string;
  profile_url: string;
  verification_status?: string;
}

interface NavbarProps {
  userInfo: UserInfo;
  className?: string;
}

const NavbarWithMobileSidebar: React.FC<NavbarProps> = ({
  userInfo,
  className,
}) => {
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
};

export default NavbarWithMobileSidebar;
