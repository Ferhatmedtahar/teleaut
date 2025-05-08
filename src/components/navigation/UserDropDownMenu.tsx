import { signOut } from "@/actions/auth/sign-out/signOut.action";
import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function UserDropDownMenu({
  userId,
}: {
  readonly userId: string;
}) {
  const supabase = createClient();
  const { data: userInfo } = await supabase
    .from("users")
    .select("first_name ,profile_url ")
    .eq("id", userId)
    .single();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userInfo?.profile_url}
              alt={`${userInfo?.first_name} profile`}
            />
            <AvatarFallback>{userInfo?.first_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline">{userInfo?.first_name}</span>
          <ChevronDown className="h-4 w-4 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href="/profile">
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
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
