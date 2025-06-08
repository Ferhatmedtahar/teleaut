import SignUpDetailsForm from "@/app/(auth)/_components/forms/signUp/details/SignUpDetailsForm";

import * as motion from "motion/react-client";
import Link from "next/link";
export const metadata = {
  title: "S'inscrire - Détails d'inscription",
  description: "Détails d'inscription",
};
export default function page() {
  return (
    <div className="bg-[#355869] dark:bg-[#1F2F3F] w-full relative  ">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 dark:bg-background  px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="flex  flex-col items-center lg:items-start  justify-center gap-6  max-w-md  p-2"
        >
          <SignUpDetailsForm />
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous avez déjà un compte ?
              <Link
                href="sign-in"
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
