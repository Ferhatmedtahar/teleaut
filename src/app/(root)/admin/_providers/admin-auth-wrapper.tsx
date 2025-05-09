"use client";

import { useAuth } from "../_providers/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export default function AdminAuthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
