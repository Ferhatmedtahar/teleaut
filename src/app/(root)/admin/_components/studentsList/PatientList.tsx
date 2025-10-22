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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/helpers/formatDate";
import { Trash2, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deleteStudent } from "../../_lib/admin";

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  emergency_contact: string;
  address: string;
  created_at: string;
}

interface StudentsListClientProps {
  readonly patients: Patient[];
}

export default function PatientList({ patients }: StudentsListClientProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const result = await deleteStudent(id);
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Patients List</h2>
      </div>

      <div className="rounded-md border border-border/50 dark:border-border/80">
        <Table>
          <TableHeader className="hover:bg-primary-200/40 ">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Emergency Contact</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient: Patient) => (
              <TableRow key={patient.id} className="hover:bg-primary-200/40 ">
                <TableCell className="font-medium">
                  {patient.first_name} {patient.last_name}
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{formatDate(patient.created_at)}</TableCell>
                <TableCell>{patient.address}</TableCell>
                <TableCell>{patient.emergency_contact}</TableCell>
                <TableCell>
                  <Link href={`/profile/${patient.id}`}>
                    <User className="h-4 w-4" />
                  </Link>
                </TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 "
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete Student Account
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this student account?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-500 hover:bg-red-600"
                          onClick={() => onDelete(patient.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
