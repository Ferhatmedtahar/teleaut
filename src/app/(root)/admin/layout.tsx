import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import type React from "react";
import { getCurrentUser } from "./_lib/auth";

export default async function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Check if user is admin
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="dashboard" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" asChild>
            <a href="/admin">Dashboard</a>
          </TabsTrigger>
          <TabsTrigger value="unverified" asChild>
            <a href="/admin/unverified">Unverified Teachers</a>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
