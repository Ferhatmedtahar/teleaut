import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";
import { redirect } from "next/navigation";
import ResetPasswordForm from "../_components/forms/reset-password/ResetPassword";
import { verifyToken } from "../_lib/verifyToken";
export const metadata = {
  title: "Reinitialiser le mot de passe",
  description: "Reinitialiser le mot de passe",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  readonly searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;
  if (!token) {
    return redirect("/sign-up/fail-auth");
  }
  const { id } = await verifyToken(token);
  return (
    <div className="  bg-[#18706e] dark:bg-[hsl(177,75%,14%)] w-full relative">
      <Link href="/sign-in" className="absolute top-10 right-10">
        <Button size={"sm"} className="text-sm sm:text-base cursor-pointer">
          connecter
        </Button>
      </Link>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-background  px-4 lg:rounded-tl-[6rem]">
        <ResetPasswordForm id={id} />
      </div>
    </div>
  );
}
