"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
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
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  Kategori,
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
} from "@/api/announcementApi";

const kategoriSchema = z.object({
  nama: z.string().min(1, "Nama kategori harus diisi"),
});

const KategoriPage: React.FC = () => {
  const { user, loading } = useAuth(true);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKategori, setEditingKategori] = useState<Kategori | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof kategoriSchema>>({
    resolver: zodResolver(kategoriSchema),
    defaultValues: {
      nama: "",
    },
  });

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      fetchKategori();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const fetchKategori = async () => {
    setIsLoading(true);
    try {
      const data = await getAllKategori();
      setKategori(data);
    } catch {
      toast({
        title: "Error",
        description: "Gagal memuat data kategori. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof kategoriSchema>) => {
    try {
      if (editingKategori) {
        await updateKategori(editingKategori.id, data.nama);
        toast({
          title: "Sukses",
          description: "Kategori berhasil diperbarui",
        });
      } else {
        await createKategori(data.nama);
        toast({
          title: "Sukses",
          description: "Kategori berhasil ditambahkan",
        });
      }
      fetchKategori();
      form.reset();
      setEditingKategori(null);
    } catch {
      toast({
        title: "Error",
        description: "Gagal menyimpan kategori. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteKategori(id);
      toast({ title: "Sukses", description: "Kategori berhasil dihapus" });
      fetchKategori();
    } catch {
      toast({
        title: "Error",
        description: "Gagal menghapus kategori. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== "ADMIN") {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Manajemen Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mb-6"
            >
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Kategori</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {editingKategori ? "Perbarui" : "Tambah"} Kategori
              </Button>
              {editingKategori && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingKategori(null);
                    form.reset();
                  }}
                >
                  Batal
                </Button>
              )}
            </form>
          </Form>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Kategori</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kategori.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingKategori(item);
                          form.setValue("nama", item.nama);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Apakah Anda yakin?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Ini akan
                              menghapus kategori secara permanen.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(item.id)}
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KategoriPage;
