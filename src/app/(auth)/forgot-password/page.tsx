import { Button } from "@/components/common/buttons/Button";
import MobileTeleLogo from "@/components/home/MobileLogo";
import Link from "next/link";
import ForgotPasswordForm from "../_components/forms/forgot-password/ForgotPasswordForm";
export const metadata = {
  title: "Mot de passe oublé",
  description: "Mot de passe oublé",
};
export default function ForgotPasswordPage() {
  return (
    <div className="bg-[#18706e]  dark:bg-[hsl(177,75%,14%)] w-full relative">
      <Link
        href="/"
        className="lg:hidden absolute top-5 left-5 sm:top-10 sm:left-10"
      >
        <MobileTeleLogo textColor="text-primary dark:text-primary-50" />
      </Link>
      <Link
        href="/sign-in"
        className="absolute  top-5 right-5 sm:top-10 sm:right-10"
      >
        <Button className="text-sm sm:text-base  cursor-pointer">
          Connecter
        </Button>
      </Link>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-background  px-4 lg:rounded-tl-[6rem]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
