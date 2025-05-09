"use client";

import { approveTeacher } from "@/actions/admin/approveTeacher.action";
import { Button } from "@/components/common/buttons/Button";
import { useUser } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyTeacherButtonProps {
  readonly teacherId: string;
  readonly teacherEmail: string;
  readonly isVerified: boolean;
}

export default function VerifyTeacherButton({
  teacherId,
  isVerified,
  teacherEmail,
}: VerifyTeacherButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const router = useRouter();

  const handleVerify = async () => {
    if (!user?.id || user.role !== "admin") return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("teacherId", teacherId);
      formData.append("email", teacherEmail);
      formData.append("verify", isVerified ? "false" : "true");
      const result = await approveTeacher(formData);
      if (!result.success) {
        toast.error(result.message);
      }
      if (result.success) {
        toast.success("Teacher approved successfully");
        router.refresh();
      }
      // if (!response.ok) {
      //   throw new Error("Failed to verify teacher");
      // }

      // // Refresh the page to show updated status
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
      {isLoading ? "Processing..." : isVerified ? "Reject" : "Approve"}
    </Button>
  );
}
