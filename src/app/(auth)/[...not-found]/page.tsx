"use client";
import { Button } from "@/components/common/buttons/Button";
import Link from "next/link";

export default function notFound() {
  return (
    <div className="bg-[#355869] dark:bg-[#1F2F3F] w-full h-screen">
      <div className="flex flex-col dark:bg-background bg-gray-50 rounded-tl-[6rem]  items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">404 - Page non trouvée</h1>
        <p className="text-lg">
          La page que vous recherchez n&apos;existe pas.
        </p>
        <Link href="/sign-up/info">
          <Button className="mt-6" size="lg">
            Revenir à la page d&apos;accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}
