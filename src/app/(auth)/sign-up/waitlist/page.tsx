"use client";

import { roles } from "@/types/roles.enum";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function WaitlistPage() {
  const router = useRouter();
  const toastShown = useRef(false);

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      router.push("/sign-up/info");
      return;
    }

    if (role !== roles.doctor && !toastShown.current) {
      toastShown.current = true;
      toast.error(
        "Vous n'êtes pas autorisé à accéder à cette page. Veuillez vous inscrire en tant qu'enseignant si vous souhaitez demander une fonctionnalité."
      );
      router.push("/sign-up/info");
      return;
    }

    if (role === roles.doctor && !toastShown.current) {
      toastShown.current = true;
      toast.success("Votre demande a été soumise avec succès !", {
        description:
          "L'équipe de TeleAustism est en train de l'examiner et vous enverra un e-mail une fois votre demande traitée.",
        duration: 5000,
      });
    }
  }, [router]);

  return (
    <div className="  bg-[#18706e] dark:bg-[hsl(177,75%,14%)] w-full relative">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50  dark:bg-background  px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="bg-gray-50 dark:bg-background w-full min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Merci!</h1>
            <p className="text-lg text-gray-600">
              Votre demande a été envoyée avec succès. L'équipe TeleAustism
              l'étudie actuellement et vous contactera dès son traitement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
