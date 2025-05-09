// import { verifyAction } from "@/actions/auth/verify-token/verify.action";
// import { verifyToken } from "@/app/(auth)/_lib/verifyToken"; // helper to decode/validate token
// import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
// import { createClient } from "@/lib/supabase/server";
// import { redirect } from "next/navigation";

// export default async function VerifyPage({
//   searchParams,
// }: {
//   readonly searchParams: Promise<{ token: string }>;
// }) {
//   const { token } = await searchParams;

//   if (!token) {
//     return redirect("/sign-up/fail-auth");
//   }
//   let updateSuccessful = false;
//   try {
//     const payload = await verifyToken(token);
//     const supabase = await createClient();
//     console.log("verification payload", payload);

//     const { error } = await supabase
//       .from("users")
//       .update({ verification_status: VERIFICATION_STATUS.APPROVED })
//       .eq("id", payload.id);

//     if (error) {
//       console.error("Supabase update failed:", error);
//       throw new Error("Update failed");
//     }

//     const { success } = await verifyAction(token);
//     updateSuccessful = success;
//   } catch (err) {
//     console.error("Verification or update failed:", err);
//   }
//   if (updateSuccessful) {
//     console.log("#fff", "Verification successful he should be in home page");
//     redirect("/");
//   } else {
//     redirect("/sign-up/fail-auth");
//   }
// }
// import { redirect } from "next/navigation";

// export default async function VerifyPage({
//   searchParams,
// }: {
//   readonly searchParams: Promise<{ token: string }>;
// }) {
//   const { token } = await searchParams;

//   if (!token) {
//     return redirect("/sign-up/fail-auth");
//   }

//   redirect(`/api/auth/verify?token=${token}`);
// }

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
    <div className="bg-[#355869] w-full relative">
      <div className="flex flex-col items-center justify-center h-screen py-10 gap-6 sm:gap-8 md:gap-10 lg:gap-14 bg-gray-50 px-6 lg:items-start lg:px-24 lg:rounded-tl-[6rem]">
        <div className="flex flex-col items-center justify-center gap-4 w-full ">
          <h1 className="text-xl text-gray-800 font-semibold">
            Verifying your account...
          </h1>
          <p className="text-gray-500">
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
