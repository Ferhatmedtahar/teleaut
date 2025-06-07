"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => {
        router.replace(`/api/auth/verify?token=${token}`);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      router.replace("/sign-up/fail-auth");
    }
  }, [token, router]);

  return (
    <div className="bg-[#355869] dark:bg-[#1F2F3F] w-full relative">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 dark:bg-background  px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="flex flex-col items-center justify-center gap-4 w-full ">
          <h1 className="text-xl text-gray-800 dark:text-primary-100 font-semibold">
            Verifying your account...
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we complete your verification.
          </p>
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
