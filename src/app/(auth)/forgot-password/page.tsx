import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";
import ForgotPasswordForm from "../_components/forms/forgot-password/ForgotPasswordForm";
export default function ForgotPasswordPage() {
  return (
    <div className="bg-[#355869]  dark:bg-[#1F2F3F] w-full relative">
      <Link href="/sign-in" className="absolute top-10 right-10">
        <Button size={"lg"} className="text-base cursor-pointer">
          Connecter
        </Button>
      </Link>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-background  px-4 lg:rounded-tl-[6rem]">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
