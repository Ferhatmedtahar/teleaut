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

// <header
//     className={cn(
//       "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6",
//       className
//     )}
//   >
//     {/* Left section - Mobile menu button and logo */}
//     <div className="flex items-center gap-3">
//       {/* Mobile menu button */}
//       <button
//         onClick={toggle}
//         className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200 md:hidden"
//         aria-label="Open sidebar"
//       >
//         <Menu className="h-6 w-6" />
//       </button>

//       {/* Logo - hidden on mobile when sidebar is available */}
//       <Link href="/" className="hidden md:block">
//         <span className="text-xl font-bold text-foreground">LOGO</span>
//       </Link>
//     </div>

//     {/* Center section - Could add search or other elements */}
//     <div className="flex-1 flex justify-center md:justify-start md:ml-8">
//       {/* Add search bar or other elements here if needed */}
//     </div>

//     {/* Right section - User info and actions */}
//     <div className="flex items-center gap-3">
//       {/* User profile section */}
//       <div className="flex items-center gap-2">
//         {userInfo.profile_url ? (
//           <img
//             src={userInfo.profile_url}
//             alt={`${userInfo.first_name}'s profile`}
//             className="h-8 w-8 rounded-full object-cover ring-2 ring-primary/20"
//           />
//         ) : (
//           <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//             <span className="text-sm font-medium text-primary">
//               {userInfo.first_name.charAt(0).toUpperCase()}
//             </span>
//           </div>
//         )}
//         <span className="hidden sm:block text-sm font-medium text-foreground">
//           {userInfo.first_name}
//         </span>
//       </div>

//       {/* Add more user actions here if needed (notifications, settings, etc.) */}
//     </div>
//   </header>
// );

export default NavbarWithMobileSidebar;
