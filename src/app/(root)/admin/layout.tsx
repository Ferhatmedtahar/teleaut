"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import type React from "react";

function getTabFromPath(path: string): string {
  if (path.includes("/admin/unverified")) return "unverified";
  if (path.includes("/admin/videos")) return "videos";
  return "dashboard";
}
export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathName = usePathname();

  const user = useUser();
  console.log("admin layout user", user);
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-6 ">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs
        value={getTabFromPath(pathName)}
        defaultValue="dashboard"
        className="w-full mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dashboard" key={"dashboard"} asChild>
            <Link href="/admin">Dashboard</Link>
          </TabsTrigger>
          <TabsTrigger value="unverified" key={"/admin/unverified"} asChild>
            <Link href="/admin/unverified">Unverified Teachers</Link>
          </TabsTrigger>
          <TabsTrigger value="videos" key={"/admin/videos"} asChild>
            <Link href="/admin/videos">Videos</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
