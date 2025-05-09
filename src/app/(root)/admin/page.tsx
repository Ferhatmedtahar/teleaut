import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

import UserChart from "./_components/user-chart";
import { getAdminStats } from "./_lib/admin";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the platform",
};

function StatsCards({
  stats,
}: {
  readonly stats: Awaited<ReturnType<typeof getAdminStats>>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTeachers}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalStudents}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Verifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingVerifications}</div>
        </CardContent>
      </Card>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getAdminStats();

  return (
    <>
      <StatsCards stats={stats} />
      <UserChart stats={stats} />
    </>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<div>Loading statistics...</div>}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
