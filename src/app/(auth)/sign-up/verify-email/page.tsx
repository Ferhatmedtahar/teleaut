"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
export default function EmailConfirmationPage() {
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem("role"); // ✅ move inside effect
    if (!role) return;

    if (role !== "student") {
      toast.error(
        "You're not allowed to access this page. Please sign up as a student if you want to request a feature."
      );
      router.push("/sign-up/info");
    } else {
      toast.success("We've sent a confirmation email to your inbox.", {
        description:
          "Please check it and verify your email address to continue to your dashboard.",
        duration: 5000,
      });
    }
  }, [router]); // ✅ remove `toast` — it doesn't need to be here

  return (
    <div className="bg-[#355869] w-full relative  ">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="bg-gray-50 w-full min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl text-center space-y-6">
            <h1 className="text-4xl font-bold text-gray-800">
              Verify Your Email
            </h1>
            <p className="text-lg text-gray-600">
              We've successfully sent a confirmation email to your inbox. Please
              check it and verify your email address to continue to your
              dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
