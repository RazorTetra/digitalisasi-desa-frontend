// src/app/admin/tamu-wajib-lapor/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  CalendarIcon,
} from "lucide-react";
import {
  TamuWajibLapor,
  TamuStatus,
  getAllLaporan,
  updateStatus,
  deleteLaporan,
} from "@/api/tamuWajibLaporApi";

const ITEMS_PER_PAGE = 10;

const statusColors: Record<TamuStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const AdminTamuWajibLaporPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth(true);
  const [laporan, setLaporan] = useState<TamuWajibLapor[]>([]);
  const [filteredLaporan, setFilteredLaporan] = useState<TamuWajibLapor[]>([]);
  const [selectedLaporan, setSelectedLaporan] = useState<TamuWajibLapor | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TamuStatus | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [date, setDate] = useState<Date | undefined>(undefined);
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

  const fetchLaporan = useCallback(async () => {
    try {
      const data = await getAllLaporan();
      setLaporan(data);
      setFilteredLaporan(data);
      setStats(calculateStats(data));
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal memuat data laporan";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, calculateStats]);

  const filterLaporan = useCallback(() => {
    let filtered = laporan;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nik.includes(searchTerm)
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    if (date) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === date.toDateString();
      });
    }

    setFilteredLaporan(filtered);
    setCurrentPage(1);
  }, [laporan, searchTerm, statusFilter, date]);

  useEffect(() => {
    if (!authLoading && user?.role === "ADMIN") {
      void fetchLaporan();
    }
  }, [authLoading, user, fetchLaporan]);

  useEffect(() => {
    filterLaporan();
  }, [searchTerm, statusFilter, date, filterLaporan]);

  const handleStatusUpdate = async (id: string, status: TamuStatus) => {
    try {
      const statusMessage =
        status === "APPROVED" ? "Laporan telah disetujui" : "Laporan ditolak";

      await updateStatus(id, { status, statusMessage });

      const updatedLaporan = laporan.map((item) =>
        item.id === id ? { ...item, status, statusMessage } : item
      );
      setLaporan(updatedLaporan);
      setStats(calculateStats(updatedLaporan));

      toast({
        title: "Sukses",
        description: `Status berhasil diperbarui menjadi ${status}`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengubah status laporan";
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
      setStats(calculateStats(updatedLaporan));
      toast({
        title: "Sukses",
        description: "Laporan berhasil dihapus",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal menghapus laporan";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Tracking Code,Nama,NIK,Status,Tanggal Lapor,Alamat Asal,Tujuan,Lama Menginap,Tempat Menginap,Nomor Telepon",
    ];
    const data = filteredLaporan.map((item) =>
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
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  const paginatedData = filteredLaporan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredLaporan.length / ITEMS_PER_PAGE);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Laporan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disetujui
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ditolak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manajemen Tamu Wajib Lapor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama, NIK, atau kode tracking..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as TamuStatus | "ALL")
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px]">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date
                    ? format(date, "PPP", { locale: id })
                    : "Filter Tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {date && (
              <Button
                variant="ghost"
                onClick={() => setDate(undefined)}
                className="px-2"
              >
                Reset Tanggal
              </Button>
            )}
            <Button onClick={exportToCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>

          {/* Table Component continues here... */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tracking Code</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>NIK</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal Lapor</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.trackingCode}
                        </TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>{item.nik}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              statusColors[item.status]
                            }`}
                          >
                            {item.status}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(item.createdAt)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setSelectedLaporan(item);
                                setIsDetailOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {item.status === "PENDING" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-600"
                                  onClick={() =>
                                    handleStatusUpdate(item.id, "APPROVED")
                                  }
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                  onClick={() =>
                                    handleStatusUpdate(item.id, "REJECTED")
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Konfirmasi Hapus
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus laporan
                                    ini? Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-600"
                                  >
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {Math.min(filteredLaporan.length, ITEMS_PER_PAGE)}{" "}
                  dari {filteredLaporan.length} data
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      )
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Laporan Tamu</DialogTitle>
            <DialogDescription>
              Tracking Code: {selectedLaporan?.trackingCode}
            </DialogDescription>
          </DialogHeader>
          {selectedLaporan && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nama Lengkap
                  </p>
                  <p>{selectedLaporan.nama}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">NIK</p>
                  <p>{selectedLaporan.nik}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Nomor Telepon
                  </p>
                  <p>{selectedLaporan.nomorTelepon}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <p
                    className={`inline-block px-2 py-1 rounded-full text-sm ${
                      statusColors[selectedLaporan.status]
                    }`}
                  >
                    {selectedLaporan.status}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Alamat Asal
                  </p>
                  <p>{selectedLaporan.alamatAsal}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tempat Menginap
                  </p>
                  <p>{selectedLaporan.tempatMenginap}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Lama Menginap
                  </p>
                  <p>{selectedLaporan.lamaMenginap} hari</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Tujuan Kunjungan
                  </p>
                  <p>{selectedLaporan.tujuan}</p>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">
                  Status Message
                </p>
                <p>{selectedLaporan.statusMessage || "-"}</p>
              </div>
              <div className="col-span-2 space-y-2">
                <p className="text-sm font-medium text-gray-500">Timestamp</p>
                <p className="text-sm">
                  Dibuat: {formatDate(selectedLaporan.createdAt)}
                </p>
                <p className="text-sm">
                  Diperbarui: {formatDate(selectedLaporan.updatedAt)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTamuWajibLaporPage;
