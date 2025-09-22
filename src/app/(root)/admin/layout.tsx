"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/providers/UserProvider";
import { useTheme } from "next-themes";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import type React from "react";

function getTabFromPath(path: string): string {
  if (path.includes("/admin/patients-list")) return "patients-list";
  if (path.includes("/admin/doctors-list")) return "doctors-list";
  return "dashboard";
}

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathName = usePathname();
  const user = useUser();
  // Check if user is authenticated and is an admin
  if (!user || user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4 transition-colors duration-200 dark:bg-[#000211] dark:text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#16222A] dark:text-white">
          Admin Dashboard
        </h1>
      </div>

      <Tabs
        value={getTabFromPath(pathName)}
        defaultValue="dashboard"
        className="w-full mb-8"
        key={pathName}
      >
        <TabsList
          className="w-full flex flex-wrap md:flex-nowrap gap-2 bg-transparent dark:bg-transparent"
          key={pathName}
        >
          <TabsTrigger
            value="dashboard"
            key={"dashboard"}
            className="flex-1 bg-primary-800 hover:bg-primary-600  dark:text-white text-white dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-200"
            asChild
          >
            <Link href="/admin">Dashboard</Link>
          </TabsTrigger>

          <TabsTrigger
            value="students-list"
            key={"/admin/patients-list"}
            className="flex-1 bg-primary-800 hover:bg-primary-600  dark:text-white text-white dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-200"
            asChild
          >
            <Link href="/admin/patients-list">Patients List</Link>
          </TabsTrigger>
          <TabsTrigger
            value="teachers-list"
            key={"/admin/list-teachers"}
            className="flex-1 bg-primary-800 hover:bg-primary-600  dark:text-white text-white dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-200"
            asChild
          >
            <Link href="/admin/doctors-list">Doctors List</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="bg-background rounded-lg  p-4 transition-colors duration-200">
        {children}
      </div>
    </div>
  );
}
