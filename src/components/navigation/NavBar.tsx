"use client";

import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/UserProvider";
import { Bell, Plus, Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import UserDropDownMenu from "./UserDropDownMenu";

interface NavbarProps {
  readonly className?: string;
  readonly userInfo?: {
    first_name: string;
    profile_url: string;
  };
}

export function Navbar({ className, userInfo }: NavbarProps) {
  const user = useUser();
  const role = user?.role;
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus the search input when mobile search is shown
  useEffect(() => {
    if (showMobileSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  if (!user) return null;

  return (
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center border-b  border-border/20 bg-background px-4 md:px-6 lg:px-10 ${className}`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side with menu toggle and logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">LOGO</span>
          </Link>
        </div>

        {/* Desktop search */}
        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Form action="/">
            <Input
              type="search"
              name="query"
              placeholder="Chercher"
              className="pl-10 pr-10 rounded-full bg-muted"
            />

            <div className="absolute inset-y-0 left-3 flex items-center">
              <Search className="h-5 w-5 dark:text-white/80 text-muted-foreground" />
            </div>
            <button type="submit" className="hidden">
              Search
            </button>
          </Form>
        </div>

        {/* Mobile search trigger button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open search"
          onClick={() => setShowMobileSearch(true)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Right side with buttons and profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {(role === "teacher" || role === "admin") && (
            <>
              <Link href="/create-video" passHref>
                <Button
                  variant="default"
                  size="lg"
                  className="gap-1 hidden sm:flex"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publier</span>
                </Button>
              </Link>

              {/* Mobile-only publish button */}
              <Link href="/create-video" passHref>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 sm:hidden"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>
          <UserDropDownMenu userInfo={userInfo} />
        </div>
      </div>

      {/* Mobile search overlay - YouTube style */}
      {showMobileSearch && (
        <div className="fixed inset-0 bg-background dark:bg-[#000211] z-50 flex flex-col">
          <div className="flex items-center p-4 border-b">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowMobileSearch(false)}
              className="mr-3"
            >
              <X className="h-5 w-5" />
            </Button>

            <Form action="/" className="flex-1">
              <div className="relative w-full">
                <Input
                  ref={searchInputRef}
                  type="search"
                  name="query"
                  placeholder="Chercher"
                  className="w-full pl-10 pr-4 rounded-full bg-muted"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 inset-y-0 my-auto"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </Form>
          </div>

          {/* Recent searches could go here */}
          <div className="flex-1 p-4 overflow-auto">
            {/* This area could be populated with recent searches or trending topics */}
            <p className="text-muted-foreground text-sm mb-2">
              Recherches récentes
            </p>
            <div className="space-y-2">
              {/* This would be a map of recent searches in a real implementation */}
              <div className="flex items-center p-2 hover:bg-muted rounded-md cursor-pointer">
                <Search className="h-4 w-4 mr-3 text-muted-foreground" />
                <span>Exemple de recherche récente</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
