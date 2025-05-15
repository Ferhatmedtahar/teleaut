import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";

export default function VideoNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold mb-2">Video Not Found</h2>
      <p className="text-muted-foreground mb-6">
        The video you&apos;re looking for doesn&apos;t exist or was removed.
      </p>
      <Button asChild>
        <Link href="/">Back to Videos</Link>
      </Button>
    </div>
  );
}
