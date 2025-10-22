import { Suspense } from "react";

import AppointmentsChart from "./_components/dashboard/AppointmentsChart";
import LoadingSkeleton from "./_components/dashboard/LoadingDashboardSkeleton";
import StatsCards from "./_components/dashboard/StatsCards";
import UserChart from "./_components/dashboard/user-chart";
import { getAdminStats, getAppointmentsStatsOverTime } from "./_lib/admin";
export const metadata = {
  title: "Tableau de Bord Admin | Gestion de la Plateforme",
  description:
    "Accédez aux outils essentiels pour gérer les utilisateurs, le contenu, les statistiques et les paramètres. Le centre de contrôle principal pour administrer efficacement la plateforme.",
};
async function DashboardContent() {
  const stats = await getAdminStats();
  const videosOverTime = await getAppointmentsStatsOverTime();

  return (
    <>
      <StatsCards stats={stats} />
      <UserChart stats={stats} />
      <AppointmentsChart appointmentsOverTime={videosOverTime} />
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
