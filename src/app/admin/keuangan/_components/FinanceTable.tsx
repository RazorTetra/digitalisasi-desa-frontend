// src/app/admin/keuangan/_components/FinanceTable.tsx

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Button } from "@/components/ui/button";
  import { Pencil, Trash2 } from "lucide-react";
  import { formatCurrency } from "@/lib/currency";
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
  
  interface FinanceItem {
    id: string;
    uraian: string;
    anggaran: number;
    realisasi: number;
  }
  
  interface FinanceTableProps {
    items: FinanceItem[];
    onEdit: (item: FinanceItem) => void;
    onDelete: (id: string) => Promise<void>;
    isLoading?: boolean;
  }
  
  export function FinanceTable({ 
    items, 
    onEdit, 
    onDelete  }: FinanceTableProps) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Uraian</TableHead>
            <TableHead className="text-right">Anggaran</TableHead>
            <TableHead className="text-right">Realisasi</TableHead>
            <TableHead className="text-right">Sisa</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.uraian}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.anggaran)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.realisasi)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(item.anggaran - item.realisasi)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus item ini? Tindakan ini tidak dapat dibatalkan.
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
    );
  }