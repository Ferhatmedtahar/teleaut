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
import { z } from "zod";
import { deleteStudent } from "../../_lib/admin";

const deleteStudentSchema = z.string();
type deleteStudentSchemaType = z.infer<typeof deleteStudentSchema>;
interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  class: string;
  branch: string;
  created_at: string;
}

interface StudentsListClientProps {
  readonly students: Student[];
}

export default function StudentsListClient({
  students,
}: StudentsListClientProps) {
  // const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      console.log(id, "id");
      const result = await deleteStudent(id);
      if (result.success) {
        toast.success(result.message);
      }
      if (!result.success) {
        toast.error(result.message);
      }
      // router.refresh();
    } catch (error) {
      console.error("Error deleting student:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students List</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="hover:bg-primary-200/40 ">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="hover:bg-primary-200/40 ">
                <TableCell className="font-medium">
                  {student.first_name} {student.last_name}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{formatDate(student.created_at)}</TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>{student.branch}</TableCell>
                <TableCell>
                  <Link href={`/profile/${student.id}`}>
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
                          onClick={() => onDelete(student.id)}
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
