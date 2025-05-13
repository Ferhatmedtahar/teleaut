import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "../../_lib/admin";

export default function StatsCards({
  stats,
}: {
  readonly stats: Awaited<ReturnType<typeof getAdminStats>>;
}) {
  const statsArray = Object.entries(stats);
  const separateNameByCapitalLetter = (name: string): string => {
    return name.replace(/([a-z])([A-Z])/g, "$1 $2");
  };
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      {statsArray.length > 0 &&
        statsArray.map(([key, value]) => (
          <Card key={`${key}-${value}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize">
                {separateNameByCapitalLetter(key)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
