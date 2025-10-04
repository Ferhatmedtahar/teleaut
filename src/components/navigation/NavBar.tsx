"use client";

import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/UserProvider";
import { Menu, Search, X } from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchFormReset from "../forms/SearchFormReset";
import TeleaustismLogo from "../home/Logo";
import UserDropDownMenu from "./UserDropDownMenu";

interface NavbarProps {
  readonly className?: string;
  readonly userInfo?: {
    first_name: string;
    profile_url: string;
  };
  readonly onMenuToggle?: () => void;
}

export function Navbar({ className, userInfo, onMenuToggle }: NavbarProps) {
  const user = useUser();
  const router = useRouter();
  const role = user?.role;
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const params = useSearchParams();

  const [search, setSearch] = useState(params.get("query") ?? "");
  const [mobileSearch, setMobileSearch] = useState(params.get("query") ?? "");

  useEffect(() => {
    if (showMobileSearch && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [showMobileSearch]);

  // Handle mobile search submit
  const handleMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;

    if (query?.trim()) {
      setShowMobileSearch(false);
      router.push(`/?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleDesktopSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;

    if (query?.trim()) {
      router.push(`/?query=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!user) return null;

  return (
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center border-b border-border/20 dark:border-border/90 bg-background px-4 md:px-6 lg:px-10 ${className}`}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center">
            <TeleaustismLogo />
          </Link>
        </div>

        <div className="relative mx-auto hidden w-full max-w-md md:block  px-2 md:px-0">
          <Form
            action="/"
            onSubmit={handleDesktopSearchSubmit}
            id="search-form"
            className="search-form"
          >
            <Input
              ref={searchInputRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="query"
              placeholder="Chercher"
              className="pl-10 rounded-full"
            />

            <div className="absolute inset-y-0 left-3 flex items-center">
              <button type="submit" className="hover:cursor-pointer">
                <Search className="h-5 w-5 dark:text-primary-200/80 text-muted-foreground" />
              </button>
            </div>
            {search && (
              <div className="absolute inset-y-0 right-3 flex items-center">
                <SearchFormReset setSearch={setSearch} />
              </div>
            )}
          </Form>
        </div>

        <div className="flex items-center gap-2 md:gap-2">
          {/* Mobile search trigger button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden border"
            aria-label="Open search"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {user.id ? <UserDropDownMenu userInfo={userInfo} /> : <p>Guest</p>}
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

            <form onSubmit={handleMobileSearchSubmit} className="flex-1">
              <div className="relative w-full">
                <Input
                  ref={mobileSearchInputRef}
                  type="text"
                  name="query"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder="Chercher"
                  className="w-full pl-10 pr-16 rounded-full bg-muted"
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
            </form>
          </div>

          {/* Recent searches could go here */}
          <div className="flex-1 p-4 overflow-auto">
            <p className="text-muted-foreground text-sm mb-2">
              Recherches récentes
            </p>
            <div className="space-y-2">
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
