import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { CheckCircle, FileIcon, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import VerifyTeacherButton from "../../_components/verify-teacher-button";
import { getTeacherById, getTeacherFiles } from "../../_lib/admin";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const teacher = await getTeacherById(params.id);

  if (!teacher) {
    return {
      title: "Teacher Not Found",
    };
  }

  return {
    title: `Review: ${teacher.first_name} ${teacher.last_name}`,
  };
}

function TeacherProfile({
  teacher,
}: {
  teacher: NonNullable<Awaited<ReturnType<typeof getTeacherById>>>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={teacher.profile_url || ""}
            alt={`${teacher.first_name} ${teacher.last_name}`}
          />
          <AvatarFallback className="text-lg">
            {teacher.first_name[0]}
            {teacher.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>
            {teacher.first_name} {teacher.last_name}
          </CardTitle>
          <CardDescription>{teacher.email}</CardDescription>
          {teacher.phone_number && (
            <CardDescription>{teacher.phone_number}</CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.specialties &&
                teacher.specialties.map((specialty: string, index: number) => (
                  <Badge key={index}>{specialty}</Badge>
                ))}
            </div>
          </div>

          {teacher.bio && (
            <div>
              <h3 className="font-medium mb-2">Bio</h3>
              <p className="text-sm text-muted-foreground">{teacher.bio}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium mb-2">Account Status</h3>
            <div className="flex items-center gap-2">
              {teacher.verification_status === VERIFICATION_STATUS.APPROVED ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified</span>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <span>Not Verified</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeacherFiles({
  files,
}: {
  files: Awaited<ReturnType<typeof getTeacherFiles>>;
}) {
  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p>No files uploaded by this teacher.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {files.map((file: any) => (
        <Card key={file.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {file.title ?? file.file_type}
            </CardTitle>
            {file.description && (
              <CardDescription>{file.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <FileIcon className="h-5 w-5" />
              <span className="text-sm">{file.file_path.split("/").pop()}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <a href={file.file_url} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

function TeacherFilesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {[1, 2].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-4 w-32" />
            </div>
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

async function TeacherFilesContent({ teacherId }: { teacherId: string }) {
  const files = await getTeacherFiles(teacherId);

  return <TeacherFiles files={files} />;
}

async function TeacherVerificationActions({
  teacher,
}: {
  teacher: NonNullable<Awaited<ReturnType<typeof getTeacherById>>>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verification Actions</CardTitle>
        <CardDescription>
          Review the teacher's documents and verify their account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {teacher.verification_status === VERIFICATION_STATUS.APPROVED ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            This teacher has already been approved.
          </div>
        ) : (
          <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md">
            This teacher is waiting to be approved.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <VerifyTeacherButton
          teacherId={teacher.id}
          isVerified={
            teacher.verification_status === VERIFICATION_STATUS.APPROVED
          }
        />
      </CardFooter>
    </Card>
  );
}

async function TeacherDetailsContent({ teacherId }: { teacherId: string }) {
  const teacher = await getTeacherById(teacherId);

  if (!teacher) {
    notFound();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <TeacherProfile teacher={teacher} />
        <TeacherVerificationActions teacher={teacher} />
      </div>

      <div>
        <Tabs defaultValue="documents">
          <TabsList className="mb-4">
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <Suspense fallback={<TeacherFilesSkeleton />}>
              <TeacherFilesContent teacherId={teacherId} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default async function TeacherDetails({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Teacher Review</h2>
        <Button variant="outline" asChild>
          <a href="/admin/unverified">Back to List</a>
        </Button>
      </div>

      <Suspense fallback={<div>Loading teacher details...</div>}>
        <TeacherDetailsContent teacherId={id} />
      </Suspense>
    </div>
  );
}
