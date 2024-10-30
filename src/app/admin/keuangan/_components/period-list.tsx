/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(admin)/keuangan/_components/period-list.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { getAllPeriods, deletePeriod, type Period } from "@/api/financeApi";

// Event bus sederhana untuk refresh
const REFRESH_EVENT = "refreshPeriodList";
export const refreshPeriodList = () => {
  window.dispatchEvent(new Event(REFRESH_EVENT));
};

export function PeriodList() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadPeriods = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllPeriods();
      setPeriods(data.sort((a, b) => b.tahun - a.tahun));
    } catch (error) {
      toast({
        title: "Gagal memuat data periode",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadPeriods();

    // Subscribe ke event refresh
    window.addEventListener(REFRESH_EVENT, loadPeriods);
    window.addEventListener("focus", loadPeriods);

    return () => {
      window.removeEventListener(REFRESH_EVENT, loadPeriods);
      window.removeEventListener("focus", loadPeriods);
    };
  }, [loadPeriods]);

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus periode ini?")) {
      return;
    }

    try {
      await deletePeriod(id);
      await loadPeriods(); // Refresh data setelah hapus
      toast({
        title: "Berhasil menghapus periode",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Gagal menghapus periode",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tahun</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {periods.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                Belum ada periode keuangan
              </TableCell>
            </TableRow>
          ) : (
            periods.map((period) => (
              <TableRow key={period.id}>
                <TableCell>{period.tahun}</TableCell>
                <TableCell>
                  {new Date(period.createdAt).toLocaleDateString("id-ID")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/keuangan/periode/${period.id}`}>
                          Detail
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(period.id)}
                        className="text-red-600"
                      >
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
