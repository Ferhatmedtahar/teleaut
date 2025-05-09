"use client";

import { useState } from "react";
import { Button } from "@/components/common/buttons/Button";
import { useAuth } from "../_providers/auth-provider";
import { useRouter } from "next/navigation";

interface VerifyTeacherButtonProps {
  teacherId: string;
  isVerified: boolean;
}

export default function VerifyTeacherButton({
  teacherId,
  isVerified,
}: VerifyTeacherButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const handleVerify = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("teacherId", teacherId);
      formData.append("verify", isVerified ? "false" : "true");

      const response = await fetch("/api/admin/verify-teacher", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to verify teacher");
      }

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error("Error verifying teacher:", error);
      alert("Failed to update verification status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleVerify}
      disabled={isLoading}
      variant={isVerified ? "destructive" : "default"}
    >
      {isLoading
        ? "Processing..."
        : isVerified
        ? "Revoke Verification"
        : "Approve Teacher"}
    </Button>
  );
}
