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

interface AppointmentChartProps {
  readonly appointmentsOverTime: { name: string; count: number }[];
}

export default function AppointmentsChart({
  appointmentsOverTime,
}: AppointmentChartProps) {
  return (
    <Card className="col-span-4 mt-6">
      <CardHeader>
        <CardTitle className="text-xl py-4">
          Videos Uploaded Each Month
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={appointmentsOverTime}
            key={`${appointmentsOverTime.length}`}
          >
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
