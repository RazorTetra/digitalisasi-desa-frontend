/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Search,
  ArrowUpDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import {
  Pengumuman,
  Kategori,
  getAllPengumuman,
  createPengumuman,
  updatePengumuman,
  deletePengumuman,
  getAllKategori,
  getPengumumanById,
} from "@/api/announcementApi";

const pengumumanSchema = z.object({
  judul: z.string().min(1, "Judul harus diisi"),
  isi: z.string().min(1, "Isi pengumuman harus diisi"),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  kategoriId: z.string().min(1, "Kategori harus dipilih"),
});

const AdminPengumumanPage: React.FC = () => {
  const { user, loading } = useAuth(true);
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([]);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Pengumuman>("tanggal");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterKategoriId, setFilterKategoriId] = useState<string | null>(null);

  const addForm = useForm<z.infer<typeof pengumumanSchema>>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: "",
      isi: "",
      tanggal: "",
      kategoriId: "",
    },
  });

  const editForm = useForm<z.infer<typeof pengumumanSchema>>({
    resolver: zodResolver(pengumumanSchema),
    defaultValues: {
      judul: "",
      isi: "",
      tanggal: "",
      kategoriId: "",
    },
  });

  useEffect(() => {
    if (!loading && user?.role === "ADMIN") {
      fetchPengumuman();
      fetchKategori();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user]);

  const fetchPengumuman = async () => {
    setIsLoading(true);
    try {
      const data = await getAllPengumuman();
      setPengumuman(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pengumuman",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const data = await getAllKategori();
      setKategori(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data kategori",
        variant: "destructive",
      });
    }
  };

  const handleAdd = async (data: z.infer<typeof pengumumanSchema>) => {
    try {
      const formattedData = {
        ...data,
        tanggal: new Date(data.tanggal).toISOString(),
      };
      await createPengumuman(formattedData);
      toast({
        title: "Sukses",
        description: "Pengumuman berhasil ditambahkan",
      });
      fetchPengumuman();
      setIsAddDialogOpen(false);
      addForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambah pengumuman",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (data: z.infer<typeof pengumumanSchema>) => {
    if (!selectedId) return;
    try {
      const formattedData = {
        ...data,
        tanggal: new Date(data.tanggal).toISOString(),
      };
      await updatePengumuman(selectedId, formattedData);
      toast({ title: "Sukses", description: "Pengumuman berhasil diperbarui" });
      fetchPengumuman();
      setIsEditDialogOpen(false);
      editForm.reset();
      setSelectedId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui pengumuman",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePengumuman(id);
      toast({ title: "Sukses", description: "Pengumuman berhasil dihapus" });
      fetchPengumuman();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus pengumuman",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = async (id: string) => {
    try {
      const data = await getPengumumanById(id);
      editForm.reset({
        judul: data.judul,
        isi: data.isi,
        tanggal: new Date(data.tanggal).toISOString().split("T")[0],
        kategoriId: data.kategoriId,
      });
      setSelectedId(id);
      setIsEditDialogOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pengumuman",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: keyof Pengumuman) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredAndSortedPengumuman = useMemo(() => {
    return pengumuman
      .filter((item) => {
        const matchesSearch =
          item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.isi.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
          !filterKategoriId || item.kategoriId === filterKategoriId;
        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (a[sortField] < b[sortField])
          return sortDirection === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField])
          return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [pengumuman, searchTerm, filterKategoriId, sortField, sortDirection]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== "ADMIN") {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>;
  }

  const PengumumanForm: React.FC<{
    form: typeof addForm;
    onSubmit: (data: z.infer<typeof pengumumanSchema>) => Promise<void>;
    submitText: string;
  }> = ({ form, onSubmit, submitText }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Isi Pengumuman</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tanggal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kategoriId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {kategori.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{submitText}</Button>
      </form>
    </Form>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Manajemen Pengumuman</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => addForm.reset()}>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Pengumuman
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Pengumuman</DialogTitle>
                </DialogHeader>
                <PengumumanForm
                  form={addForm}
                  onSubmit={handleAdd}
                  submitText="Tambah"
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex space-x-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Cari pengumuman..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <Select
                value={filterKategoriId || "all"}
                onValueChange={(value) =>
                  setFilterKategoriId(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {kategori.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("judul")}
                    >
                      Judul{" "}
                      {sortField === "judul" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("kategoriId")}
                    >
                      Kategori{" "}
                      {sortField === "kategoriId" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("tanggal")}
                    >
                      Tanggal{" "}
                      {sortField === "tanggal" && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                      )}
                    </TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedPengumuman.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.judul}</TableCell>
                      <TableCell>
                        {kategori.find((k) => k.id === item.kategoriId)?.nama ||
                          "Tidak ada kategori"}
                      </TableCell>
                      <TableCell>
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(item.id)}
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
                                menghapus pengumuman secara permanen.
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Pengumuman</DialogTitle>
            </DialogHeader>
            <PengumumanForm
              form={editForm}
              onSubmit={handleEdit}
              submitText="Simpan"
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default AdminPengumumanPage;
