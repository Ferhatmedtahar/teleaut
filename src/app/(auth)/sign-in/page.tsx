import SignInForm from "@/app/(auth)/_components/forms/signIn/SignIn";
import { Button } from "@/components/common/buttons/Button";
import MobileCognaciaLogo from "@/components/home/MobileLogo";
import * as motion from "motion/react-client";
import Link from "next/link";

export const metadata = {
  title: "Connexion",
  description: "Connexion",
};
export default function SignInPage() {
  return (
    <div className=" bg-[#18706e]  dark:bg-[hsl(177,75%,14%)]  w-full relative  ">
      <Link
        href="/"
        className="lg:hidden absolute top-5 left-5 sm:top-10 sm:left-10"
      >
        <MobileCognaciaLogo textColor="text-primary dark:text-primary-50" />
      </Link>
      <Link
        href="/sign-up/info"
        className="absolute top-5 right-5 sm:top-10 sm:right-10"
      >
        <Button className="text-sm sm:text-base cursor-pointer">
          S&apos;inscrire
        </Button>
      </Link>
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50  dark:bg-background px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex  flex-col items-center lg:items-start  justify-center gap-6  max-w-md  p-2"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl font-bold">Se Connecter</h1>
            <p className="text-sm sm:text-lg">
              Ravi de vous revoir. Veuillez vous connecter à votre compte
            </p>
          </div>

          <SignInForm />
        </motion.div>
      </div>
    </div>
  );
}
