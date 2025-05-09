"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/buttons/Button";
import { getCurrentUser } from "../_lib/auth";

export default function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await getCurrentUser();
        setIsAdmin(user?.role === "admin");
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdmin();
  }, []);

  if (isLoading) return null;

  if (!isAdmin) return null;

  return (
    <Button asChild>
      <Link href="/admin">Admin Dashboard</Link>
    </Button>
  );
}
