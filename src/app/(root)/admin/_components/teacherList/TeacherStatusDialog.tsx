"use client";

import { Button } from "@/components/common/buttons/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { updateTeacherStatus } from "../../_lib/admin";

interface TeacherStatusDialogProps {
  teacherId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

export function TeacherStatusDialog({
  teacherId,
  currentStatus,
  onStatusChange,
}: TeacherStatusDialogProps) {
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await updateTeacherStatus(teacherId, VERIFICATION_STATUS.APPROVED);
      onStatusChange();
    } catch (error) {
      console.error("Error approving teacher:", error);
    } finally {
      setIsLoading(false);
      setIsApproveOpen(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await updateTeacherStatus(teacherId, VERIFICATION_STATUS.REJECTED);
      onStatusChange();
    } catch (error) {
      console.error("Error rejecting teacher:", error);
    } finally {
      setIsLoading(false);
      setIsRejectOpen(false);
    }
  };

  // Don't show status change options for already approved or rejected teachers
  if (
    currentStatus === VERIFICATION_STATUS.APPROVED ||
    currentStatus === VERIFICATION_STATUS.REJECTED
  ) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <AlertDialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Approve
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this teacher? They will be able
              to access all teacher features on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-500 hover:bg-green-600"
              onClick={handleApprove}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Approve"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Reject
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Teacher</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this teacher? They will not be
              able to access teacher features on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={handleReject}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
