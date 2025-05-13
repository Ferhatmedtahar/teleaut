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
import { Trash2 } from "lucide-react";
import { useState } from "react";

// Dummy data for students
const dummyStudents = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    created_at: "2023-01-15T10:30:00Z",
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    created_at: "2023-02-20T14:45:00Z",
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Johnson",
    email: "michael.johnson@example.com",
    created_at: "2023-03-10T09:15:00Z",
  },
  {
    id: "4",
    first_name: "Emily",
    last_name: "Williams",
    email: "emily.williams@example.com",
    created_at: "2023-04-05T16:20:00Z",
  },
  {
    id: "5",
    first_name: "David",
    last_name: "Brown",
    email: "david.brown@example.com",
    created_at: "2023-05-12T11:10:00Z",
  },
];

export default function StudentsListPage() {
  const [students, setStudents] = useState(dummyStudents);
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock delete function that doesn't rely on server actions
  const handleDeleteStudent = (id: string) => {
    setIsDeleting(true);
    // Simulate API call delay
    setTimeout(() => {
      setStudents(students.filter((student) => student.id !== id));
      setIsDeleting(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students List</h2>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">
                  {student.first_name} {student.last_name}
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{formatDate(student.created_at)}</TableCell>
                <TableCell>
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
                          onClick={() => handleDeleteStudent(student.id)}
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
