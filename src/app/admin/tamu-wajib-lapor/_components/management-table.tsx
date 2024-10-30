// src/app/admin/tamu-wajib-lapor/_components/management-table.tsx
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { TamuWajibLapor, TamuStatus } from "@/api/tamuWajibLaporApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  CalendarIcon,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const statusColors: Record<TamuStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

interface TWLManagementTableProps {
  isLoading: boolean;
  filteredData: TamuWajibLapor[];
  onFilterChange: (
    searchTerm: string,
    status: TamuStatus | "ALL",
    date?: Date
  ) => void;
  onStatusUpdate: (id: string, status: TamuStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onExport: () => void;
}

export function TWLManagementTable({
  isLoading,
  filteredData,
  onFilterChange,
  onStatusUpdate,
  onDelete,
}: TWLManagementTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TamuStatus | "ALL">("ALL");
  const [date, setDate] = useState<Date>();
  const [selectedLaporan, setSelectedLaporan] = useState<TamuWajibLapor | null>(
    null
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleFilterChange = () => {
    onFilterChange(searchTerm, statusFilter, date);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy, HH:mm", { locale: id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Manajemen Tamu Wajib Lapor</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama, NIK, atau kode tracking..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange();
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value as TamuStatus | "ALL");
              handleFilterChange();
            }}
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
                {date ? format(date, "PPP", { locale: id }) : "Filter Tanggal"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  handleFilterChange();
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button
              variant="ghost"
              onClick={() => {
                setDate(undefined);
                handleFilterChange();
              }}
              className="px-2"
            >
              Reset Tanggal
            </Button>
          )}
        </div>

        {/* Table Content */}
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
                                  onStatusUpdate(item.id, "APPROVED")
                                }
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600"
                                onClick={() =>
                                  onStatusUpdate(item.id, "REJECTED")
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
                                  Apakah Anda yakin ingin menghapus laporan ini?
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(item.id)}
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
                Menampilkan {Math.min(filteredData.length, ITEMS_PER_PAGE)} dari{" "}
                {filteredData.length} data
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
    </Card>
  );
}
