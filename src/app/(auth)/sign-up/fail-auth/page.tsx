"use client";
import { useEffect } from "react";
import { toast } from "sonner";

export default function FailAuthPage() {
  useEffect(() => {
    toast.error(
      "Échec de l'inscription ! Veuillez contacter l'administrateur pour plus d'informations.",
      {
        duration: 10000,
      }
    );
  }, []);

  return (
    <div className="bg-[#355869] dark:bg-[#1F2F3F] w-full relative  ">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 dark:bg-background  px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="flex min-h-screen w-full flex-col gap-4 items-center justify-center">
          <h1 className="text-3xl font-semibold">Sign up failed</h1>
          <p className="text-lg text-center">
            Please contact the admin for more information.
            <br /> You can also try again later
          </p>
        </div>
      </div>
    </div>
  );
}
