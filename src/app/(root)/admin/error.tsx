"use client";

import { Button } from "@/components/common/buttons/Button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">
        An error occurred while loading the admin dashboard.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
