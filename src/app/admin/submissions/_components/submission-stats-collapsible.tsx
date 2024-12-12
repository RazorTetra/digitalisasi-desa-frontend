// src/app/admin/submissions/_components/submission-stats-collapsible.tsx
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SubmissionStats } from "@/api/submissionApi";

interface SubmissionStatsCollapsibleProps {
  stats: SubmissionStats[];
}

export function SubmissionStatsCollapsible({ stats }: SubmissionStatsCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const totalSubmissions = stats.reduce((acc, stat) => acc + stat.total, 0);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Pengajuan Surat
              </p>
              <p className="text-2xl font-bold">{totalSubmissions}</p>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="outline">
                {isOpen ? (
                  <>
                    Sembunyikan Detail <ChevronUp className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Lihat Detail <ChevronDown className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.kategori} className="p-4">
                  <h4 className="text-sm font-medium mb-2">{stat.kategori}</h4>
                  <div className="text-2xl font-bold mb-2">{stat.total}</div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      Diproses: {stat.statusCount.DIPROSES}
                    </Badge>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Selesai: {stat.statusCount.SELESAI}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </CollapsibleContent>
        </CardContent>
      </Card>
    </Collapsible>
  );
}