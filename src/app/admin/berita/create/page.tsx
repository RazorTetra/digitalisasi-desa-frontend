"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BeritaForm } from "../_components/BeritaForm";
import { KategoriBerita, createBerita, type CreateBeritaData } from "@/api/beritaApi";
import { getAllKategori } from "@/api/kategoriBeritaApi";

export default function CreateBeritaPage() {
  const { user } = useAuth(true);
  const [kategori, setKategori] = useState<KategoriBerita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const data = await getAllKategori();
        setKategori(data);
      } catch  {
        toast({
          title: "Error",
          description: "Gagal memuat data kategori. Silakan coba lagi.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === "ADMIN") {
      fetchKategori();
    }
  }, [user, toast]);

  const handleSubmit = async (values: CreateBeritaData) => {
    setIsSubmitting(true);
    try {
      await createBerita(values);
      toast({
        title: "Berhasil",
        description: "Berita berhasil dibuat",
      });
      router.push("/admin/berita");
    } catch  {
      toast({
        title: "Error",
        description: "Gagal membuat berita. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Buat Berita Baru</h1>
          <p className="text-muted-foreground mt-1">
            Buat dan publikasikan berita baru
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Form Berita</CardTitle>
          </CardHeader>
          <CardContent>
            <BeritaForm
              kategori={kategori}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}