"use client";
import { signOut } from "@/actions/auth/sign-out/signOut.action";
import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/providers/UserProvider";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
export default function UserDropDownMenu({
  userInfo,
}: {
  readonly userInfo:
    | {
        first_name: string;
        profile_url: string;
      }
    | undefined;
}) {
  const user = useUser();
  if (!user) return null;
  const { role } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="p-5 focus:outline-none focus:ring-0 ring-0 shadow-none hover:bg-primary-200/50 dark:hover:bg-primary-50/40 dark:text-white"
      >
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userInfo?.profile_url}
              alt={`${userInfo?.first_name} profile`}
            />
            <AvatarFallback>
              {userInfo?.first_name?.charAt(0) ?? "?"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{userInfo?.first_name}</span>
          <ChevronDown className="h-4 w-4 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="dark:bg-background dark:border-primary-800"
      >
        <DropdownMenuItem className="hover:cursor-pointer ">
          <Link href="/profile">
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        {role === "admin" && (
          <DropdownMenuItem className="hover:cursor-pointer">
            <Link href="/admin">
              <span>Administrateur</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="hover:cursor-pointer"
          onClick={async () => {
            await signOut();
            redirect("/sign-in");
          }}
        >
          <span className="text-destructive">Deconnection</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
