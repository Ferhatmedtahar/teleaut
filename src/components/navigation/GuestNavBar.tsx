// "use client";

// import { Button } from "@/components/common/buttons/Button";
// import Link from "next/link";
// import CognaciaLogo from "../home/Logo";

// interface GuestNavbarProps {
//   readonly className?: string;
// }

// export default function GuestNavbar({ className }: GuestNavbarProps) {
//   return (
//     <header
//       className={`sticky top-0 z-50 flex h-16 w-full items-center border-b border-border/60 dark:border-border/90 bg-background px-4 md:px-6 lg:px-10 ${className}`}
//     >
//       <div className="flex w-full items-center justify-between">
//         {/* Left side with logo */}
//         <div className="flex items-center">
//           <Link href="/" className="flex items-center">
//             <CognaciaLogo />
//           </Link>
//         </div>

//         {/* Right side with auth buttons */}
//         <div className="flex items-center gap-3">
//           <Link href="/sign-in" passHref>
//             <Button
//               size="sm"
//               variant="outline"
//               className="w-full sm:w-auto  border-[#355869]/10 hover:border-[#355869]/20"
//             >
//               Se connecter
//             </Button>
//           </Link>
//           <Link href="/sign-up" passHref>
//             <Button variant="default" size="sm">
//               S&apos;inscrire
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
"use client";

import { Button } from "@/components/common/buttons/Button";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import CognaciaLogo from "../home/Logo";

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
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize search from URL params
  useState(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearch(searchParam);
    }
  });

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      // Navigate to search results with search parameter
      router.push(`/?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 flex h-16 w-full items-center border-b border-border/60 dark:border-border/90 bg-background px-4 md:px-6 lg:px-10 ${className}`}
    >
      <div className="flex w-full items-center justify-between gap-4">
        {/* Left side with logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <CognaciaLogo />
          </Link>
        </div>

        {/* Middle - Search Component */}
        <div className="flex-1 max-w-2xl mx-4 relative">
          <Form
            action="/"
            onSubmit={handleSearchSubmit}
            id="search-form"
            className="relative"
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
        </div>

        {/* Right side with auth buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/sign-in" passHref>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto border-[#355869]/10 hover:border-[#355869]/20"
            >
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
