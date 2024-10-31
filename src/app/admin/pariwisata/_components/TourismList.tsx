// src/app/admin/pariwisata/_components/TourismList.tsx
import React from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Pencil, Trash2 } from "lucide-react";
import { Tourism } from '@/api/tourismApi';

interface TourismListProps {
  items: Tourism[];
  onDelete: (id: string) => Promise<boolean | void>;
}

// Separate Image component for better reusability and optimization
const DestinationImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-square w-20 h-20">
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 80px, 80px"
      className="object-cover rounded"
      priority={false}
      loading="lazy"
      quality={75}
    />
  </div>
);

// Action buttons component for better organization
const ActionButtons = ({ 
  onEdit,
  onDelete 
}: { 
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <div className="flex justify-end gap-2">
    <Button
      variant="ghost"
      size="icon"
      onClick={onEdit}
      aria-label="Edit destinasi"
    >
      <Pencil className="h-4 w-4" />
    </Button>
    <Button
      variant="ghost"
      size="icon"
      onClick={onDelete}
      className="text-red-500 hover:text-red-700"
      aria-label="Hapus destinasi"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export function TourismList({ items, onDelete }: TourismListProps) {
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    if (deleteId) {
      await onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/pariwisata/${id}`);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Gambar</TableHead>
              <TableHead>Nama Destinasi</TableHead>
              <TableHead>Lokasi</TableHead>
              <TableHead>Terakhir Diperbarui</TableHead>
              <TableHead className="w-24 text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={5} 
                  className="text-center py-8 text-muted-foreground"
                >
                  Belum ada destinasi wisata yang ditambahkan
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <DestinationImage 
                      src={item.image} 
                      alt={item.name} 
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>
                    {format(new Date(item.updatedAt), "dd MMMM yyyy", { locale: id })}
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionButtons
                      onEdit={() => handleEdit(item.id)}
                      onDelete={() => setDeleteId(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus destinasi wisata ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}