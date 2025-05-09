"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { redirect } from "next/navigation";
import type React from "react";

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const user = useUser();
  console.log("admin layout user", user);
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="dashboard" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" asChild>
            <Link href="/admin">Dashboard</Link>
          </TabsTrigger>
          <TabsTrigger value="unverified" asChild>
            <Link href="/admin/unverified">Unverified Teachers</Link>
          </TabsTrigger>
          <TabsTrigger value="videos" asChild>
            <Link href="/admin/videos">Videos</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
