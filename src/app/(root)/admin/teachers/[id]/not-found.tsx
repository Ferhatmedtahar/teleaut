import Link from "next/link";
import { Button } from "@/components/common/buttons/Button";

export default function TeacherNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold mb-2">Teacher Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The teacher you&apos;re looking for doesn&apos;t exist or you don&apos;t
        have permission to view it.
      </p>
      <Button asChild>
        <Link href="/admin/unverified">Back to Unverified Teachers</Link>
      </Button>
    </div>
  );
}
