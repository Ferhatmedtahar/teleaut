"use client";

import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Bell, ChevronDown, Menu, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Toggle sidebar through custom event
  const toggleSidebar = () => {
    const event = new CustomEvent("toggleSidebar", {
      detail: { isOpen: true },
    });
    window.dispatchEvent(event);
  };

  return (
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center border-b bg-background px-4 md:px-6 lg:px-10 ${className}`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side with menu toggle and logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="md:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">LOGO</span>
          </Link>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md md:block">
          <Input
            type="search"
            placeholder="Chercher"
            className="pl-10 pr-10 rounded-full bg-muted"
          />
          <div className="absolute inset-y-0 left-3 flex items-center">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          {/* <div className="absolute inset-y-0 right-3 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5 text-muted-foreground"
            >
              <path d="M7 4a3 3 0 016 0v6a3 3 0 11-6 0V4z" />
              <path d="M5.5 9.643a.75.75 0 00-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-1.5v-1.546A6.001 6.001 0 0016 10v-.357a.75.75 0 00-1.5 0V10a4.5 4.5 0 01-9 0v-.357z" />
            </svg>
          </div> */}
        </div>
        {/* TODO fix this on the phone to do the search correctly */}
        {/* Mobile search button */}
        <Link href="/search" passHref>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Go to search"
          >
            <Search className="h-5 w-5" />
          </Button>
        </Link>

        {/* Right side with buttons and profile */}
        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <>
              <Button
                variant="default"
                size="lg"
                className="gap-1 hidden sm:flex "
              >
                <Plus className="h-4 w-4" />
                <span>Publier</span>
              </Button>

              {/* Mobile-only publish button */}
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 sm:hidden"
              >
                <Plus className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="Rayen"
                      />
                      <AvatarFallback>R</AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">Rayen</span>
                    <ChevronDown className="h-4 w-4 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                    <span className="text-destructive">Deconnection</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={() => setIsLoggedIn(true)}
              className=" hover:cursor-pointer whitespace-nowrap"
              variant="default"
              size={"lg"}
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
