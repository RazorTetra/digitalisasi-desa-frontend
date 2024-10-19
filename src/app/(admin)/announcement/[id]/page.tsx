// src/app/(admin)/announcement/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getPengumumanById, updatePengumuman, getAllKategori, Kategori } from "@/api/announcementApi";

const pengumumanSchema = z.object({
  judul: z.string().min(1, "Judul harus diisi"),
  isi: z.string().min(1, "Isi pengumuman harus diisi"),
  tanggal: z.string().min(1, "Tanggal harus diisi"),
  kategoriId: z.string().min(1, "Kategori harus dipilih"),
});

const EditPengumumanPage: React.FC<{ params: { id: string } }> = ({ params }) => {
  const { user, loading } = useAuth(true);
  const [isLoading, setIsLoading] = useState(true);
  const [kategori, setKategori] = useState<Kategori[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof pengumumanSchema>>({
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
  }, [loading, user, params.id]);

  const fetchPengumuman = async () => {
    setIsLoading(true);
    try {
      const pengumuman = await getPengumumanById(params.id);
      form.reset({
        judul: pengumuman.judul,
        isi: pengumuman.isi,
        tanggal: new Date(pengumuman.tanggal).toISOString().split("T")[0],
        kategoriId: pengumuman.kategoriId,
      });
    } catch (error) {
      console.error("Error fetching pengumuman:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data pengumuman. Silakan coba lagi nanti.",
        variant: "destructive",
      });
      router.push("/announcement");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const data = await getAllKategori();
      setKategori(data);
    } catch (error) {
      console.error("Error fetching kategori:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data kategori. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof pengumumanSchema>) => {
    try {
      const formattedData = {
        ...data,
        tanggal: new Date(data.tanggal).toISOString(),
      };
      await updatePengumuman(params.id, formattedData);
      toast({
        title: "Sukses",
        description: "Pengumuman berhasil diperbarui",
      });
      router.push("/announcement");
    } catch (error) {
      console.error("Error updating pengumuman:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui pengumuman. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Pengumuman</CardTitle>
        </CardHeader>
        <CardContent>
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
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
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/announcement")}
                >
                  Batal
                </Button>
                <Button type="submit">Perbarui Pengumuman</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPengumumanPage;