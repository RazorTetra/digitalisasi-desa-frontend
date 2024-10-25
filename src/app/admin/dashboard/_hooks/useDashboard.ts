// src/app/admin/dashboard/_hooks/useDashboard.ts
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  getAllTourism,
  Tourism 
} from '@/api/tourismApi';
import { 
  getAllLaporan,
  TamuWajibLapor, 
} from '@/api/tamuWajibLaporApi';
import { 
  getAllPengumuman,
  Pengumuman 
} from '@/api/announcementApi';

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
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Helper untuk mendapatkan tanggal hari ini tanpa waktu
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Helper untuk menghitung status Tamu Wajib Lapor
  const calculateTamuStats = (data: TamuWajibLapor[]) => {
    // Sort by date descending untuk mendapatkan submission terbaru
    const sortedData = [...data].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      totalSubmissions: data.length,
      pending: data.filter(item => item.status === 'PENDING').length,
      approved: data.filter(item => item.status === 'APPROVED').length,
      rejected: data.filter(item => item.status === 'REJECTED').length,
      recentSubmissions: sortedData.slice(0, 5) // Ambil 5 terbaru
    };
  };

  // Helper untuk menghitung pengumuman aktif
  const calculatePengumumanStats = (data: Pengumuman[]) => {
    const today = getTodayDate();
    const sortedData = [...data].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return {
      total: data.length,
      active: data.filter(item => new Date(item.tanggal) >= today).length,
      recentAnnouncements: sortedData.slice(0, 3) // Ambil 3 terbaru
    };
  };

  const fetchStats = useCallback(async () => {
    try {
      // Fetch semua data secara parallel
      const [tourism, laporan, pengumuman] = await Promise.all([
        getAllTourism(),
        getAllLaporan(),
        getAllPengumuman()
      ]);

      // Sort tourism by date untuk mendapatkan yang terbaru
      const sortedTourism = [...tourism].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      // Compile stats
      setStats({
        tamuWajibLapor: calculateTamuStats(laporan),
        tourism: {
          totalDestinations: tourism.length,
          recentDestinations: sortedTourism.slice(0, 3) // Ambil 3 terbaru
        },
        pengumuman: calculatePengumumanStats(pengumuman)
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data dashboard. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  return {
    stats,
    isLoading,
    fetchStats
  };
};