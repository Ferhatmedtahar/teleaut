import { Suspense } from "react";

import LoadingSkeleton from "./_components/dashboard/LoadingDashboardSkeleton";
import StatsCards from "./_components/dashboard/StatsCards";
import UserChart from "./_components/dashboard/user-chart";
import { getAdminStats } from "./_lib/admin";

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing the platform",
};

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
      <Suspense fallback={<LoadingSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
