"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAdminStats } from "../_lib/admin";
export default function UserChart({
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
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#355869" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
