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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { formatDate } from "@/lib/helpers/formatDate";
import { CheckCircle, Clock, Eye, Mail, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteTeacher } from "../../_lib/admin";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  verification_status: string;

  location: string;
  education: string;
  license_file_url: string;
  created_at: string;
}

interface DoctorsListClientProps {
  readonly doctors: Doctor[];
}

export default function DoctorsList({ doctors = [] }: DoctorsListClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  console.log("doctors", doctors);
  const handleDeleteTeacher = async (id: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteTeacher(id);
      if (result.success) {
        toast.success(result.message);
      }
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case VERIFICATION_STATUS.APPROVED:
        return (
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-green-600">Verified</span>
          </div>
        );
      case VERIFICATION_STATUS.PENDING:
        return (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-yellow-500" />
            <span className="text-yellow-600">Pending</span>
          </div>
        );
      case VERIFICATION_STATUS.REJECTED:
        return (
          <div className="flex items-center gap-1">
            <XCircle className="h-4 w-4 text-red-500" />
            <span className="text-red-600">Rejected</span>
          </div>
        );
      case VERIFICATION_STATUS.EMAIL_SENT:
        return (
          <div className="flex items-center gap-1">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="bg-blue-50 text-blue-600">Email Sent</span>
          </div>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors List</h2>
      </div>

      <div className="rounded-md border border-border/50 dark:border-border/80">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>location</TableHead>
              <TableHead>education</TableHead>
              <TableHead>license url</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors && doctors.length === 0
              ? null
              : doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">
                      {doctor.first_name} {doctor.last_name}
                    </TableCell>
                    <TableCell>{doctor.email}</TableCell>
                    <TableCell>
                      {getStatusBadge(doctor.verification_status)}
                    </TableCell>
                    <TableCell>
                      <Badge>{doctor.location}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>{doctor.education}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge>
                        <Link target="_blank" href={doctor.license_file_url}>
                          License URL
                        </Link>
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(doctor.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                          asChild
                        >
                          <Link href={`/admin/teachers/${doctor.id}`}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Doctor Account
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this doctor
                                account? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel disabled={isDeleting}>
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteTeacher(doctor.id)}
                                disabled={isDeleting}
                              >
                                {isDeleting ? "Deleting..." : "Delete"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
