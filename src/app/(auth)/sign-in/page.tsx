import { Button } from "@/components/common/buttons/Button";
import SignInForm from "@/components/forms/SignIn";
import * as motion from "motion/react-client";
import Link from "next/link";
export default function SignInPage() {
  return (
    <div className="bg-[#355869] w-full relative">
      <div className="flex-center flex-col h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14  bg-gray-50 px-4 pl-24 lg:rounded-tl-[6rem] ">
        <Link href="/sign-up" className="absolute top-10 right-10">
          <Button size={"lg"} className="text-base cursor-pointer">
            S'inscrire
          </Button>
        </Link>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex flex-col items-start justify-center gap-6 self-start max-w-md "
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Se connecter</h1>
            <p className="text-lg">
              Ravi de vous revoir. Veuillez vous connecter à votre compte.
            </p>
          </div>

          <SignInForm />
        </motion.div>
      </div>
    </div>
  );
}
