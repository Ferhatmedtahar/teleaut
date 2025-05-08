"use client";

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

    if (role !== "teacher" && !toastShown.current) {
      toastShown.current = true;
      toast.error(
        "You're not allowed to access this page. Please sign up as a teacher if you want to request a feature."
      );
      router.push("/sign-up/info");
      return;
    }

    if (role === "teacher" && !toastShown.current) {
      toastShown.current = true;
      toast.success("Your request has been submitted successfully!", {
        description:
          "The Cognacia team is now reviewing it and will email you once your request has processed.",
        duration: 5000,
      });
    }
  }, [router]);

  return (
    <div className="bg-[#355869] w-full relative">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="bg-gray-50 w-full min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Thank You!</h1>
            <p className="text-lg text-gray-600">
              Your request has been successfully submitted. The Cognacia team is
              now reviewing it and will contact you once it's been processed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
