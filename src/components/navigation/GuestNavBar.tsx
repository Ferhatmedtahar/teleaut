import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";
import TeleaustismLogo from "../home/Logo";
import { ToggleThemeGuest } from "../home/ToggleThemeGuest";

interface GuestNavbarProps {
  readonly className?: string;
}

export default function GuestNavbar({ className }: GuestNavbarProps) {
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
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <div className="flex-shrink-0">
              <ToggleThemeGuest />
            </div>

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
    </>
  );
}
