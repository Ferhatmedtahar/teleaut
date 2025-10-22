"use client";

import { approveDoctor } from "@/actions/admin/approveDoctoraction";
import { rejectTeacher } from "@/actions/admin/rejectTeacher.action";
import { resendVerificationEmail } from "@/actions/admin/resendVerificationEmail.action";
import { Button } from "@/components/common/buttons/Button";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { useUser } from "@/providers/UserProvider";
import { UserVerificationStatus } from "@/types/UserVerificationStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface VerifyTeacherButtonProps {
  readonly doctorId: string;
  readonly doctorEmail: string;
  readonly verificationStatus: UserVerificationStatus;
}

export default function VerifyDoctorButton({
  doctorId,
  doctorEmail,
  verificationStatus,
}: VerifyTeacherButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useUser();
  const router = useRouter();

  const handleApprove = async () => {
    if (!user?.id || user.role !== "admin") return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      formData.append("email", doctorEmail);
      formData.append("verify", "true");
      const result = await approveDoctor(formData);
      if (!result.success) {
        toast.error(result.message);
      }
      if (result.success) {
        toast.success("Enseignant approuvé avec succès");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Échec de l'approbation de l'enseignant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user?.id || user.role !== "admin") return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      const result = await rejectTeacher(formData);

      if (!result.success) {
        toast.error(result.message);
      }
      if (result.success) {
        toast.success("L'enseignant a été rejeté avec succès");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Impossible de rejeter l'enseignant");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user?.id || user.role !== "admin") return;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      formData.append("email", doctorEmail);
      formData.append("verificationStatus", verificationStatus);
      const result = await resendVerificationEmail(formData);

      if (!result.success) {
        toast.error(result.message);
      }
      if (result.success) {
        toast.success("E-mail renvoyé avec succès");
      }
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Échec du renvoi de l'e-mail");
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationStatus === "APPROVED" || verificationStatus === "REJECTED") {
    return null;
  }

  return (
    <div className="flex gap-2 mt-4">
      {verificationStatus === VERIFICATION_STATUS.PENDING && (
        <>
          <Button onClick={handleApprove} disabled={isLoading}>
            {isLoading ? "Processing..." : "Approve"}
          </Button>
          <Button
            onClick={handleReject}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? "Processing..." : "Reject"}
          </Button>
        </>
      )}

      {verificationStatus === VERIFICATION_STATUS.EMAIL_SENT && (
        <Button
          onClick={handleResendEmail}
          disabled={isLoading}
          variant="outline"
          className="bg-blue-50 "
        >
          {isLoading ? "Sending..." : "Send Email Again"}
        </Button>
      )}
    </div>
  );
}
