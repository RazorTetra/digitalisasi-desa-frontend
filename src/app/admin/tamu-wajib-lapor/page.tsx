// src/app/admin/tamu-wajib-lapor/page.tsx
"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { TWLStatsCards } from "./_components/stats-cards";
import { TWLManagementTable } from "./_components/management-table";
import { useTamuWajibLapor } from "./_hooks/use-tamu-wajib-lapor";

const AdminTamuWajibLaporPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth(true);
  const { 
    isLoading,
    stats,
    filteredData,
    filterData,
    handleStatusUpdate,
    handleDelete,
    exportToCSV
  } = useTamuWajibLapor();

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Anda tidak memiliki akses ke halaman ini.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TWLStatsCards stats={stats} />
      <TWLManagementTable 
        isLoading={isLoading}
        filteredData={filteredData}
        onFilterChange={filterData}
        onStatusUpdate={handleStatusUpdate}
        onDelete={handleDelete}
        onExport={exportToCSV}
      />
    </div>
  );
};

export default AdminTamuWajibLaporPage;