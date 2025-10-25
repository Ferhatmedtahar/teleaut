"use client";
import { cn } from "@/lib/utils";
import {
  BriefcaseMedicalIcon,
  HelpCircle,
  Home,
  Info,
  MessageSquare,
  MoonIcon,
  NotebookTabs,
  Sun,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import TeleaustismLogo from "../home/Logo";
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
    title: "Rendez-vous",
    href: "/appointments",
    icon: BriefcaseMedicalIcon,
  },
  {
    title: "Notes médicales",
    href: "/medical-notes",
    icon: NotebookTabs,
  },
  {
    title: "Messages",
    href: "/messages",
    icon: MessageSquare,
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

  useEffect(() => {
    if (ismobile && onClose) {
      onClose();
    }
  }, [pathname, ismobile, onClose]);

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
      <div className=" md:hidden flex items-center justify-between p-4 border-b border-border/20 dark:border-border/90">
        <TeleaustismLogo />

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

      <nav className="flex-1 space-y-1 py-1 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
                "hover:bg-secondary-400/40 dark:hover:bg-secondary-50/20 ",
                "active:scale-[0.99] transform",
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
