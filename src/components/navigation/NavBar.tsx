"use client";

import { Button } from "@/components/common/buttons/Button";
import { useUser } from "@/providers/UserProvider";
import { Menu } from "lucide-react";
import Link from "next/link";
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

        {/* <div className="relative mx-auto hidden w-full max-w-md md:block  px-2 md:px-0">
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
        </div> */}

        <div className="flex items-center gap-2 md:gap-2">
          {/* Mobile search trigger button */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="md:hidden border"
            aria-label="Open search"
            onClick={() => setShowMobileSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button> */}

          {user.id ? <UserDropDownMenu userInfo={userInfo} /> : <p>Guest</p>}
        </div>
      </div>
    </header>
  );
}
