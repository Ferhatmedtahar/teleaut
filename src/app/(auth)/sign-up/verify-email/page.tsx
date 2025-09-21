"use client";
import { roles } from "@/types/roles.enum";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
export default function EmailConfirmationPage() {
  const router = useRouter();
  const toastShown = useRef(false);
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) {
      router.push("/sign-up/info");
      return;
    }

    if (role !== roles.patient && !toastShown.current) {
      toastShown.current = true;
      toast.error(
        "Vous n'êtes pas autorisé à accéder à cette page. Veuillez vous inscrire en tant qu'étudiant si vous souhaitez demander une fonctionnalité."
      );
      router.push("/sign-up/info");
      return;
    }
    if (role === roles.patient && !toastShown.current) {
      toast.success(
        "Nous avons envoyé un e-mail de confirmation dans votre boîte de réception.",
        {
          description:
            "Veuillez le vérifier et vérifier votre adresse e-mail pour continuer vers votre tableau de bord.",
          duration: 5000,
        }
      );
    }
  }, [router]);

  return (
    <div className="bg-[#355869]  dark:bg-[#1F2F3F] w-full relative  ">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 dark:bg-background  px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="bg-gray-50 dark:bg-background w-full min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">
              Verify Your Email
            </h1>
            <p className="text-lg text-gray-600">
              We&apos;ve successfully sent a confirmation email to your inbox.
              Please check it and verify your email address to continue to your
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
