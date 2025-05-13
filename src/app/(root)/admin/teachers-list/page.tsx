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
import { CheckCircle, Clock, Eye, Trash2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Dummy data for teachers
const dummyTeachers = [
  {
    id: "1",
    first_name: "Robert",
    last_name: "Johnson",
    email: "robert.johnson@example.com",
    verification_status: VERIFICATION_STATUS.APPROVED,
    specialties: ["Mathematics", "Physics"],
    created_at: "2023-01-10T08:30:00Z",
  },
  {
    id: "2",
    first_name: "Sarah",
    last_name: "Davis",
    email: "sarah.davis@example.com",
    verification_status: VERIFICATION_STATUS.PENDING,
    specialties: ["English", "Literature"],
    created_at: "2023-02-15T11:45:00Z",
  },
  {
    id: "3",
    first_name: "James",
    last_name: "Wilson",
    email: "james.wilson@example.com",
    verification_status: VERIFICATION_STATUS.REJECTED,
    specialties: ["Chemistry", "Biology"],
    created_at: "2023-03-20T14:20:00Z",
  },
  {
    id: "4",
    first_name: "Lisa",
    last_name: "Anderson",
    email: "lisa.anderson@example.com",
    verification_status: VERIFICATION_STATUS.EMAIL_SENT,
    specialties: ["History", "Geography"],
    created_at: "2023-04-25T09:10:00Z",
  },
  {
    id: "5",
    first_name: "Michael",
    last_name: "Thompson",
    email: "michael.thompson@example.com",
    verification_status: VERIFICATION_STATUS.APPROVED,
    specialties: ["Computer Science", "Programming"],
    created_at: "2023-05-30T16:05:00Z",
  },
];

export default function TeachersListPage() {
  const [teachers, setTeachers] = useState(dummyTeachers);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Mock delete function that doesn't rely on server actions
  const handleDeleteTeacher = (id: string) => {
    setIsDeleting(true);
    // Simulate API call delay
    setTimeout(() => {
      setTeachers(teachers.filter((teacher) => teacher.id !== id));
      setIsDeleting(false);
    }, 500);
  };

  // Mock update status function
  const handleUpdateStatus = (id: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    // Simulate API call delay
    setTimeout(() => {
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === id
            ? { ...teacher, verification_status: newStatus }
            : teacher
        )
      );
      setIsUpdatingStatus(false);
    }, 500);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
          <Badge variant="outline" className="bg-blue-50 text-blue-600">
            Email Sent
          </Badge>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teachers List</h2>
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
              <TableHead>Status</TableHead>
              <TableHead>Specialties</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachers.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell className="font-medium">
                  {teacher.first_name} {teacher.last_name}
                </TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>
                  {getStatusBadge(teacher.verification_status)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {teacher.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{formatDate(teacher.created_at)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                      asChild
                    >
                      <Link href={`/admin/teachers/${teacher.id}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Link>
                    </Button>

                    {teacher.verification_status ===
                      VERIFICATION_STATUS.PENDING && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() =>
                            handleUpdateStatus(
                              teacher.id,
                              VERIFICATION_STATUS.APPROVED
                            )
                          }
                          disabled={isUpdatingStatus}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() =>
                            handleUpdateStatus(
                              teacher.id,
                              VERIFICATION_STATUS.REJECTED
                            )
                          }
                          disabled={isUpdatingStatus}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

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
                            Delete Teacher Account
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this teacher
                            account? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDeleteTeacher(teacher.id)}
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
