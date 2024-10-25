"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { BeritaList } from "./_components/BeritaList";
import { getAllBerita, type Berita } from "@/api/beritaApi";

export default function AdminBeritaPage() {
  const { user } = useAuth(true);
  const [berita, setBerita] = useState<Berita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchBerita = async () => {
    try {
      const data = await getAllBerita();
      setBerita(data);
    } catch  {
      toast({
        title: "Error",
        description: "Gagal memuat data berita. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchBerita();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Berita</h1>
            <p className="text-muted-foreground mt-1">
              Kelola berita dan artikel website desa
            </p>
          </div>
          <Button onClick={() => router.push("/admin/berita/create")}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Berita
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Berita</CardTitle>
            <CardDescription>
              Daftar semua berita yang telah dipublikasikan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <BeritaList data={berita} onRefresh={fetchBerita} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}