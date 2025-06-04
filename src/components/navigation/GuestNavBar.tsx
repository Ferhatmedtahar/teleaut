"use client";

import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";
import CognaciaLogo from "../home/Logo";

interface GuestNavbarProps {
  readonly className?: string;
}

export default function GuestNavbar({ className }: GuestNavbarProps) {
  return (
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center border-b border-border/20 dark:border-border/90 bg-background px-4 md:px-6 lg:px-10 ${className}`}
    >
      <div className="flex w-full items-center justify-between">
        {/* Left side with logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <CognaciaLogo />
          </Link>
        </div>

        {/* Right side with auth buttons */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in" passHref>
            <Button variant="ghost" size="sm">
              Se connecter
            </Button>
          </Link>
          <Link href="/sign-up" passHref>
            <Button variant="default" size="sm">
              S&apos;inscrire
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
