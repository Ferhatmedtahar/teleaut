import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { getUnverifiedTeachers } from "../_lib/admin";

export const metadata = {
  title: "Unverified Teachers",
  description: "Manage unverified teacher accounts",
};

function TeachersList({
  teachers,
}: {
  readonly teachers: Awaited<ReturnType<typeof getUnverifiedTeachers>>;
}) {
  if (teachers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No unverified teachers found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {teachers.map((teacher) => (
        <Card key={teacher.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={teacher.profile_url ?? ""}
                    alt={`${teacher.first_name} ${teacher.last_name}`}
                  />
                  <AvatarFallback>
                    {teacher.first_name[0]}
                    {teacher.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">
                    {teacher.first_name} {teacher.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {teacher.email}
                  </p>
                  <div className="flex gap-4 mt-2">
                    {teacher.specialties ? (
                      teacher.specialties.map((specialty: string) => (
                        <div
                          key={specialty}
                          className="text-xs p-1  text-primary-900 bg-primary-50 rounded-lg"
                        >
                          {specialty}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No specialties
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <Button asChild>
                <Link href={`/admin/teachers/${teacher.id}`}>Review</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TeachersListSkeleton() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-32 mt-2" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

async function UnverifiedTeachersContent() {
  const teachers = await getUnverifiedTeachers();

  return <TeachersList teachers={teachers} />;
}

export default function UnverifiedTeachers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Unverified Teachers</h2>
      </div>

      <Suspense fallback={<TeachersListSkeleton />}>
        <UnverifiedTeachersContent />
      </Suspense>
    </div>
  );
}
