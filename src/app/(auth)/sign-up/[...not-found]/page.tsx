"use client";
import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";

export default function notFound() {
  return (
    <div className="flex flex-col dark:bg-background bg-gray-50   items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page not found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Link href="/sign-up/info">
        <Button className="mt-6" size="lg">
          Go to Sign Up
        </Button>
      </Link>
    </div>
  );
}
