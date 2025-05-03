import SignUpBasicInfoForm from "@/app/(auth)/_components/forms/signUp/info/SignUpBasicInfoForm";
import { Button } from "@/components/common/buttons/Button";

import * as motion from "motion/react-client";
import Link from "next/link";
export default function page() {
  return (
    <div className="bg-[#355869] w-full relative  ">
      <Link href="/sign-in" className="absolute top-10 right-10">
        <Button size={"lg"} className="text-base cursor-pointer">
          Connecter
        </Button>
      </Link>
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex  flex-col items-center lg:items-start  justify-center gap-6  max-w-md  p-2"
        >
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">S&apos;inscrire</h1>
            <p className="text-lg">
              Veuillez créer un compte pour accéder à nos ressources en ligne
            </p>
          </div>

          {/* <SignUpForm /> */}
          <SignUpBasicInfoForm />
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
