"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ConfirmationPage() {
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (!role) return;
    if (role !== "teacher") {
      toast.error(
        "You're not allowed to access this page. Please sign up as a teacher if you want to request a feature."
      );
      router.push("/sign-up/info");
    }
    if (role === "teacher") {
      toast.success("Your request has been successfully uploaded.", {
        description:
          "We will email you once your request has been accepted or rejected.",
        duration: 5000,
      });
    }
  }, [router]);

  return (
    <div className="bg-[#355869] w-full relative  ">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="bg-gray-50 w-full min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">Thank You!</h1>
            <p className="text-lg text-gray-600">
              Your request has been successfully submitted. The Cognacia team is
              now reviewing it and will contact you once it's been accepted or
              rejected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
