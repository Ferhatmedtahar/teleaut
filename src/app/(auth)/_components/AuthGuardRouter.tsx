"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const signedUp = localStorage.getItem("signedUp");
    const role = localStorage.getItem("role");

    if (signedUp && role) {
      localStorage.removeItem("signedUp");
      localStorage.removeItem("role");
    }
  }, [router]);

  return <></>;
}
