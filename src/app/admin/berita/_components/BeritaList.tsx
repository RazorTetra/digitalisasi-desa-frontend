"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Eye} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Berita, deleteBerita } from "@/api/beritaApi";

interface BeritaListProps {
  data: Berita[];
  onRefresh: () => Promise<void>;
}

export function BeritaList({ data, onRefresh }: BeritaListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const filteredData = data.filter(
    (berita) =>
      berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      berita.penulis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteBerita(deleteId);
      await onRefresh();
      toast({
        title: "Berhasil",
        description: "Berita telah dihapus",
      });
    } catch  {
      toast({
        title: "Error",
        description: "Gagal menghapus berita. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };


  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari berita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[400px]">Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Tanggal</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((berita) => (
              <TableRow key={berita.id}>
                <TableCell className="font-medium">{berita.judul}</TableCell>
                <TableCell>{berita.penulis}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {berita.kategori.map((kat) => (
                      <Badge key={kat.id} variant="secondary">
                        {kat.nama}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(berita.tanggal), "dd MMMM yyyy", { locale: id })}
                </TableCell>
                {/* <TableCell>
                  {berita.isHighlight ? (
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                      Highlight
                    </Badge>
                  ) : null}
                </TableCell> */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Buka menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/berita/${berita.slug}`} target="_blank">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Lihat
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/admin/berita/${berita.id}`}>
                        <DropdownMenuItem>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      {/* <DropdownMenuItem
                        onClick={() => toggleHighlight(berita.id, berita.isHighlight)}
                      >
                        {berita.isHighlight ? (
                          <>
                            <StarOff className="mr-2 h-4 w-4" />
                            Hapus dari Highlight
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Tambah ke Highlight
                          </>
                        )}
                      </DropdownMenuItem> */}
                      <DropdownMenuItem
                        onClick={() => setDeleteId(berita.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Tidak ada berita yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus berita ini? Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}