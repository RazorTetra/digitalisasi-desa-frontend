// src/app/admin/tamu-wajib-lapor/_hooks/use-tamu-wajib-lapor.ts
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  TamuWajibLapor,
  TamuStatus,
  getAllLaporan,
  updateStatus,
  deleteLaporan,
} from "@/api/tamuWajibLaporApi";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export function useTamuWajibLapor() {
  const [laporan, setLaporan] = useState<TamuWajibLapor[]>([]);
  const [filteredData, setFilteredData] = useState<TamuWajibLapor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const { toast } = useToast();

  const calculateStats = useCallback((data: TamuWajibLapor[]): Stats => {
    return {
      total: data.length,
      pending: data.filter((item) => item.status === "PENDING").length,
      approved: data.filter((item) => item.status === "APPROVED").length,
      rejected: data.filter((item) => item.status === "REJECTED").length,
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllLaporan();
      setLaporan(data);
      setFilteredData(data);
      setStats(calculateStats(data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal memuat data laporan";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, calculateStats]);

  const filterData = useCallback((searchTerm: string, status: TamuStatus | "ALL", date?: Date) => {
    let filtered = laporan;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nik.includes(searchTerm)
      );
    }

    if (status !== "ALL") {
      filtered = filtered.filter((item) => item.status === status);
    }

    if (date) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === date.toDateString();
      });
    }

    setFilteredData(filtered);
  }, [laporan]);

  const handleStatusUpdate = async (id: string, status: TamuStatus) => {
    try {
      const statusMessage = status === "APPROVED" ? "Laporan telah disetujui" : "Laporan ditolak";
      await updateStatus(id, { status, statusMessage });

      const updatedLaporan = laporan.map((item) =>
        item.id === id ? { ...item, status, statusMessage } : item
      );
      
      setLaporan(updatedLaporan);
      setFilteredData((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status, statusMessage } : item))
      );
      setStats(calculateStats(updatedLaporan));

      toast({
        title: "Sukses",
        description: `Status berhasil diperbarui menjadi ${status}`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal mengubah status laporan";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLaporan(id);
      const updatedLaporan = laporan.filter((item) => item.id !== id);
      setLaporan(updatedLaporan);
      setFilteredData((prev) => prev.filter((item) => item.id !== id));
      setStats(calculateStats(updatedLaporan));
      
      toast({
        title: "Sukses",
        description: "Laporan berhasil dihapus",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Gagal menghapus laporan";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const exportToCSV = useCallback(() => {
    const headers = [
      "Tracking Code,Nama,NIK,Status,Tanggal Lapor,Alamat Asal,Tujuan,Lama Menginap,Tempat Menginap,Nomor Telepon"
    ];
    const data = filteredData.map((item) =>
      [
        item.trackingCode,
        item.nama,
        item.nik,
        item.status,
        format(new Date(item.createdAt), "dd/MM/yyyy HH:mm"),
        `"${item.alamatAsal.replace(/"/g, '""')}"`,
        `"${item.tujuan.replace(/"/g, '""')}"`,
        item.lamaMenginap,
        `"${item.tempatMenginap.replace(/"/g, '""')}"`,
        item.nomorTelepon,
      ].join(",")
    );

    const csvContent = [headers, ...data].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `laporan_tamu_${format(new Date(), "yyyyMMdd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredData]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return {
    isLoading,
    stats,
    filteredData,
    filterData,
    handleStatusUpdate,
    handleDelete,
    exportToCSV,
  };
}