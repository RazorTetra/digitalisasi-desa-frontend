// src/app/admin/tamu-wajib-lapor/_components/stats-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export function TWLStatsCards({ stats }: StatsCardsProps) {
  const statsConfig = [
    {
      title: "Total Laporan",
      value: stats.total,
      color: "text-gray-900"
    },
    {
      title: "Pending",
      value: stats.pending,
      color: "text-yellow-600"
    },
    {
      title: "Disetujui",
      value: stats.approved,
      color: "text-green-600"
    },
    {
      title: "Ditolak", 
      value: stats.rejected,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {statsConfig.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}