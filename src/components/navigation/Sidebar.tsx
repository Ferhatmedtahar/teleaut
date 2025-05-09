"use client";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging
import {
  BookOpen,
  HelpCircle,
  History,
  Home,
  Info,
  MessageSquare,
  Settings,
} from "lucide-react"; // Assuming you're using lucide-react for icons
import { useTheme } from "next-themes"; // Assuming you're using next-themes or a similar library
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
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
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps extends React.ComponentProps<"div"> {
  ismobile?: boolean;
}

const AppSidebar: React.FC<SidebarProps> = ({
  className,
  ismobile = false,
  ...props
}) => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={cn(
        "flex flex-col w-60 md:w-64 bg-background border-r border-border h-full overflow-hidden",
        className
      )}
      {...props}
    >
      {!ismobile && (
        <div className="p-4 border-b border-border md:hidden">
          <Link href="/">
            <span className="text-xl font-bold">LOGO</span>
          </Link>
        </div>
      )}
      <nav className="flex-grow space-y-1 p-2 overflow-y-auto max-h-[calc(100vh-9rem)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center rounded-sm px-3 py-3 text-sm font-medium transition-colors",
                "hover:bg-primary-200/50 dark:hover:bg-primary-50/20",
                isActive
                  ? "gradient-sidebar-light   text-foreground"
                  : "text-muted-foreground  hover:text-foreground"
                // isActive
                //   ? theme === "light"
                //     ? "gradient-sidebar-light text-foreground"
                //     : "gradient-sidebar-dark text-foreground"
                //   : "text-muted-foreground hover:text-foreground"
              )}
              // className={cn(
              //   "flex items-center  rounded-sm px-3 py-3 text-sm font-medium transition-colors",
              //   "hover:bg-muted/80",
              //   isActive
              //     ? "  gradient-sidebar-light   text-foreground"
              //     : "text-muted-foreground  hover:text-foreground"
              //   // "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
              // )}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
        <li className="flex-center mt-5">
          <Switch
            className="gradient-bg-light "
            tabIndex={0}
            onClick={toggleTheme}
          />
        </li>
      </nav>
      {/* <div className="p-4 border-t border-border mt-auto">
   
      </div>
      */}
    </div>
  );
};

export default AppSidebar;
