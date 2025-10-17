"use client";

import { Button } from "@/components/common/buttons/Button";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import TeleaustismLogo from "../home/Logo";
import { ToggleThemeGuest } from "../home/ToggleThemeGuest";

interface GuestNavbarProps {
  readonly className?: string;
}

const SearchFormReset = ({
  setSearch,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const router = useRouter();

  const reset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form") as HTMLFormElement;
    setSearch("");
    if (form) form.reset();
    // Reset URL to remove search params
    router.push("/");
  };

  return (
    <button
      aria-label="Reset the form"
      type="reset"
      onClick={reset}
      className="text-primary-600 hover:text-primary-700 dark:text-primary-50 dark:hover:text-primary-100 transition-colors"
    >
      <X className="size-5" />
    </button>
  );
};

export default function GuestNavbar({ className }: GuestNavbarProps) {
  const [search, setSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // useEffect(() => {
  //   const searchParam = searchParams.get("search");
  //   if (searchParam) {
  //     setSearch(searchParam);
  //     setMobileSearch(searchParam);
  //   }
  // }, [searchParams]);

  // useEffect(() => {
  //   if (showMobileSearch && mobileSearchInputRef.current) {
  //     mobileSearchInputRef.current.focus();
  //   }
  // }, [showMobileSearch]);

  // const handleDesktopSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (search.trim()) {
  //     // Navigate to search results with search parameter
  //     router.push(`/?search=${encodeURIComponent(search.trim())}`);
  //   }
  // };

  // const handleMobileSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const query = formData.get("search") as string;

  //   if (query?.trim()) {
  //     // Close mobile search overlay first
  //     setShowMobileSearch(false);
  //     // Navigate to search results
  //     router.push(`/?search=${encodeURIComponent(query.trim())}`);
  //   }
  // };

  return (
    <>
      <header
        className={`sticky top-0 z-50 flex h-16 w-full items-center border-b border-border/60 dark:border-border/90 bg-background px-3 sm:px-4 md:px-6 lg:px-10 ${className}`}
      >
        <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
          {/* Left side with logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center">
              <TeleaustismLogo />
            </Link>
          </div>

          {/* Desktop Search Component - Hidden on mobile */}
          {/* <div className="hidden md:flex flex-1 max-w-2xl mx-4 relative"> */}
          {/* <Form
              action="/"
              onSubmit={handleDesktopSearchSubmit}
              id="search-form"
              className="relative w-full"
            >
              <Input
                ref={searchInputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Rechercher des vidéos..."
                className="pl-10 pr-10 rounded-full w-full"
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
          </div> */}

          {/* Right side controls */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Theme toggle - always visible */}

            {/* Mobile search button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden flex-shrink-0 h-9 w-9"
              aria-label="Open search"
              onClick={() => setShowMobileSearch(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
            <div className="flex-shrink-0">
              <ToggleThemeGuest />
            </div>
            {/* Auth buttons */}
            <div className="flex items-center gap-1 sm:gap-2 ml-1 sm:ml-2">
              <Link href="/sign-in" passHref>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-2 sm:px-3 text-xs sm:text-sm h-8 sm:h-9 whitespace-nowrap border-border/30 dark:border-border/70  dark:hover:border-border/90 flex-shrink-0 "
                >
                  <span className="hidden xs:inline">Se connecter</span>
                  <span className="xs:hidden">Connexion</span>
                </Button>
              </Link>
              <Link href="/sign-up/info" passHref>
                <Button
                  variant="default"
                  size="sm"
                  className="px-2 sm:px-3 text-xs sm:text-sm h-8 sm:h-9 whitespace-nowrap flex-shrink-0"
                >
                  <span className="hidden xs:inline">S&apos;inscrire</span>
                  <span className="xs:hidden">Inscription</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile search overlay - YouTube style */}
    </>
  );
}
