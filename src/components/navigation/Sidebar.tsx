// "use client";
// import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging
// import {
//   BookOpen,
//   HelpCircle,
//   History,
//   Home,
//   Info,
//   MessageSquare,
//   MoonIcon,
//   Sun,
// } from "lucide-react"; // Assuming you're using lucide-react for icons
// import { useTheme } from "next-themes"; // Assuming you're using next-themes or a similar library
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import React from "react";
// import { Switch } from "../ui/switch";

// interface NavItem {
//   title: string;
//   href: string;
//   icon: React.FC<React.SVGProps<SVGSVGElement>>;
// }

// const navItems: NavItem[] = [
//   {
//     title: "Accueil",
//     href: "/",
//     icon: Home,
//   },
//   {
//     title: "Etude",
//     href: "/etude",
//     icon: BookOpen,
//   },
//   {
//     title: "Chat",
//     href: "/chats",
//     icon: MessageSquare,
//   },
//   {
//     title: "Historique",
//     href: "/historique",
//     icon: History,
//   },
//   {
//     title: "Aide",
//     href: "/aide",
//     icon: HelpCircle,
//   },
//   {
//     title: "A propos",
//     href: "/a-propos",
//     icon: Info,
//   },
//   // {
//   //   title: "Settings",
//   //   href: "/settings",
//   //   icon: Settings,
//   // },
// ];

// interface SidebarProps extends React.ComponentProps<"div"> {
//   ismobile?: boolean;
// }

// const AppSidebar: React.FC<SidebarProps> = ({
//   className,
//   ismobile = false,
//   ...props
// }) => {
//   const { theme, setTheme } = useTheme();
//   const pathname = usePathname();

//   const toggleTheme = () => {
//     setTheme(theme === "light" ? "dark" : "light");
//   };

//   return (
//     <div
//       // border-r border-border/20
//       className={cn(
//         "flex flex-col w-48 sm:w-52 md:w-56 lg:w-60 bg-background  h-full overflow-hidden",
//         className
//       )}
//       {...props}
//     >
//       {!ismobile && (
//         <div className="p-4 border-b border-border md:hidden">
//           <Link href="/">
//             <span className="text-xl font-bold">LOGO</span>
//           </Link>
//         </div>
//       )}
//       <nav className="flex-grow space-y-1 p-2 overflow-y-auto max-h-[calc(100vh-9rem)]">
//         {navItems.map((item) => {
//           const isActive = pathname === item.href;

//           return (
//             <Link
//               key={item.href}
//               href={item.href}
//               className={cn(
//                 "flex items-center rounded-sm px-3 py-3 text-sm font-medium transition-colors",
//                 "hover:bg-primary-200/50 dark:hover:bg-primary-50/20 ",
//                 isActive
//                   ? "gradient-sidebar-light   text-foreground"
//                   : "text-muted-foreground  dark:text-primary-100/85 hover:text-foreground"
//               )}
//             >
//               <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
//               <span>{item.title}</span>
//             </Link>
//           );
//         })}
//         <li className="flex-center gap-4 md:gap-8 lg:gap-12 mt-5  ">
//           {/* <p>light</p> */}
//           <MoonIcon className=" text-primary-700 dark:text-primary-100" />
//           <Switch
//             className="gradient-bg-light hover:cursor-pointer"
//             tabIndex={0}
//             onClick={toggleTheme}
//           />
//           <Sun className=" text-primary-700 dark:text-primary-100" />
//         </li>
//       </nav>
//     </div>
//   );
// };

// export default AppSidebar;
"use client";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  HelpCircle,
  History,
  Home,
  Info,
  MessageSquare,
  MoonIcon,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import CognaciaLogo from "../home/Logo";
import { Switch } from "../ui/switch";

interface NavItem {
  title: string;
  href: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  {
    title: "Accueil",
    href: "/",
    icon: Home,
  },
  {
    title: "Etude",
    href: "/etude",
    icon: BookOpen,
  },
  {
    title: "Chat",
    href: "/chats",
    icon: MessageSquare,
  },
  {
    title: "Historique",
    href: "/historique",
    icon: History,
  },
  {
    title: "Aide",
    href: "/aide",
    icon: HelpCircle,
  },
  {
    title: "A propos",
    href: "/a-propos",
    icon: Info,
  },
];

interface SidebarProps extends React.ComponentProps<"div"> {
  ismobile?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar: React.FC<SidebarProps> = ({
  className,
  ismobile = false,
  isOpen = false,
  onClose,
  ...props
}) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (ismobile && onClose) {
      onClose();
    }
  }, [pathname, ismobile, onClose]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (ismobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }

      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, ismobile]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleLinkClick = () => {
    if (ismobile && onClose) {
      onClose();
    }
  };

  if (!mounted) return null;

  const sidebarContent = (
    <div
      className={cn(
        "flex flex-col bg-background h-full overflow-hidden",
        ismobile ? "w-72 sm:w-80" : "w-48 sm:w-52 md:w-56 lg:w-60",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/20 dark:border-border/90">
        <CognaciaLogo />

        {ismobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 py-1 px-4 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-primary-200/50 dark:hover:bg-primary-50/20 hover:scale-[1.02]",
                "active:scale-95 transform",
                isActive
                  ? "gradient-sidebar-light text-foreground shadow-sm"
                  : "text-muted-foreground dark:text-primary-100/85 hover:text-foreground"
              )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
        {/* <div className="flex items-center justify-center gap-3 mt-5 ">
          <Sun className="h-5 w-5 text-primary-700 dark:text-primary-100" />
          <Switch
            className="gradient-bg-light data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <MoonIcon className="h-5 w-5 text-primary-700 dark:text-primary-100" />
        </div> */}
      </nav>

      {/* Theme Toggle */}
      <div className="p-5  border-t border-border/20 dark:border-border/90 w-full">
        <div className="flex items-center justify-center gap-5   ">
          <Sun className="h-5 w-5 text-primary-700 dark:text-primary-100" />
          <Switch
            className="gradient-bg-light data-[state=checked]:bg-primary data-[state=unchecked]:bg-muted"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <MoonIcon className="h-5 w-5 text-primary-700 dark:text-primary-100" />
        </div>
      </div>
    </div>
  );

  if (!ismobile) {
    return sidebarContent;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out md:hidden",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};

export default AppSidebar;
