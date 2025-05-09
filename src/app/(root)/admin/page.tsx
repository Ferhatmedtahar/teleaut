import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
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

function UserChart({
  stats,
}: {
  readonly stats: Awaited<ReturnType<typeof getAdminStats>>;
}) {
  const data = [
    { name: "Students", count: stats.totalStudents },
    { name: "Teachers", count: stats.totalTeachers },
    {
      name: "Verified Teachers",
      count: stats.totalTeachers - stats.pendingVerifications,
    },
    { name: "Unverified Teachers", count: stats.pendingVerifications },
  ];

  return (
    <Card className="col-span-4 mt-6">
      <CardHeader>
        <CardTitle>User Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        {/* <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer> */}
      </CardContent>
    </Card>
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
