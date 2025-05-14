import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getUnverifiedTeachers } from "../../_lib/admin";

export default function UnverifiedTeachersList({
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
