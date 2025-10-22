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
import { getAdminStats } from "../../_lib/admin";
export default function UserChart({
  stats,
}: {
  readonly stats: Awaited<ReturnType<typeof getAdminStats>>;
}) {
  const data = [
    { name: "Patients", count: stats.totalPatients },
    { name: "Doctors", count: stats.totalDoctors },
    {
      name: "Verified Doctors",
      count: stats.totalDoctors - stats.pendingVerifications,
    },
    { name: "Unverified Doctors", count: stats.pendingVerifications },
  ];

  return (
    <Card className="col-span-4 mt-6">
      <CardHeader>
        <CardTitle className="text-xl py-4">User Statistics</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} key={`${data.length}`}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#0b7d84" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
