// src/app/admin/dashboard/_hooks/useDashboard.ts
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAllTourism, Tourism } from "@/api/tourismApi";
import { getAllLaporan, TamuWajibLapor } from "@/api/tamuWajibLaporApi";
import { getAllPengumuman, Pengumuman } from "@/api/announcementApi";
import {
  getAllFormatSurat,
  getFormatSuratStats,
  FormatSurat,
  DownloadStats,
} from "@/api/suratApi";

export interface DashboardStats {
  // Statistik Tamu Wajib Lapor
  tamuWajibLapor: {
    totalSubmissions: number;
    pending: number;
    approved: number;
    rejected: number;
    recentSubmissions: TamuWajibLapor[]; // 5 submission terbaru
  };
  // Statistik Pariwisata
  tourism: {
    totalDestinations: number;
    recentDestinations: Tourism[]; // 3 destinasi terbaru
  };
  // Statistik Pengumuman
  pengumuman: {
    total: number;
    active: number; // Pengumuman yang tanggalnya masih aktif
    recentAnnouncements: Pengumuman[]; // 3 pengumuman terbaru
  };

  surat: {
    totalFormats: number;
    totalDownloads: number;
    recentFormats: FormatSurat[]; // 3 format surat terbaru
    downloadStats: DownloadStats[]; // Statistik download bulanan
  };
}

// src/app/admin/dashboard/_hooks/useDashboard.ts
export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Pindahkan helper functions ke dalam useCallback
  const getTodayDate = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const calculateTamuStats = useCallback((data: TamuWajibLapor[]) => {
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      totalSubmissions: data.length,
      pending: data.filter((item) => item.status === "PENDING").length,
      approved: data.filter((item) => item.status === "APPROVED").length,
      rejected: data.filter((item) => item.status === "REJECTED").length,
      recentSubmissions: sortedData.slice(0, 5),
    };
  }, []);

  const calculatePengumumanStats = useCallback(
    (data: Pengumuman[]) => {
      const today = getTodayDate();
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        total: data.length,
        active: data.filter((item) => new Date(item.tanggal) >= today).length,
        recentAnnouncements: sortedData.slice(0, 3),
      };
    },
    [getTodayDate]
  );

  const fetchStats = useCallback(async () => {
    try {
      const [tourism, laporan, pengumuman, formatSurat] = await Promise.all([
        getAllTourism(),
        getAllLaporan(),
        getAllPengumuman(),
        getAllFormatSurat(),
      ]);

      const sortedFormatSurat = [...formatSurat].sort(
        (a, b) => (b.totalDownloads || 0) - (a.totalDownloads || 0)
      );

      let downloadStats: DownloadStats[] = [];
      if (sortedFormatSurat.length > 0) {
        const mostDownloaded = sortedFormatSurat[0];
        downloadStats = await getFormatSuratStats(mostDownloaded.id);
      }

      const totalDownloads = formatSurat.reduce(
        (sum, format) => sum + (format.totalDownloads || 0),
        0
      );

      const sortedTourism = [...tourism].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setStats({
        tamuWajibLapor: calculateTamuStats(laporan),
        tourism: {
          totalDestinations: tourism.length,
          recentDestinations: sortedTourism.slice(0, 3),
        },
        pengumuman: calculatePengumumanStats(pengumuman),
        surat: {
          totalFormats: formatSurat.length,
          totalDownloads,
          recentFormats: sortedFormatSurat.slice(0, 3),
          downloadStats,
        },
      });
    } catch (err: unknown) {
      console.error("Dashboard fetch error:", err);
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, calculateTamuStats, calculatePengumumanStats]);

  return {
    stats,
    isLoading,
    fetchStats,
  };
};
