// src/app/admin/pariwisata/page.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { TourismForm } from "./_components/TourismForm";
import { TourismList } from "./_components/TourismList";
import { useTourismAdmin } from "./_hooks/useTourismAdmin";

export default function PariwisataAdminPage() {
  const { user } = useAuth(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    items,
    isLoading,
    isSubmitting,
    isInitialized,
    fetchTourism,
    handleCreate,
    handleDelete,
  } = useTourismAdmin();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchTourism();
    }
  }, [user, fetchTourism]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (values: any) => {
    const success = await handleCreate({
      name: values.name,
      description: values.description,
      location: values.location,
      mainImage: values.mainImage[0],
      gallery: Array.from(values.gallery),
    });

    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleRefresh = () => {
    fetchTourism(true); // Force refresh
  };

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
            <h1 className="text-3xl font-bold">Manajemen Pariwisata</h1>
            <p className="text-muted-foreground mt-1">
              Kelola destinasi wisata desa
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Destinasi
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Destinasi Wisata</CardTitle>
            <CardDescription>
              Daftar semua destinasi wisata yang tersedia
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!isInitialized || isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <TourismList items={items} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>

        {/* Form Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Destinasi Wisata</DialogTitle>
            </DialogHeader>
            <TourismForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
