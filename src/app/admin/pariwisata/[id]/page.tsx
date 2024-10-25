/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/pariwisata/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Tourism, getTourismById } from "@/api/tourismApi";
import { TourismForm } from "../_components/TourismForm";
import { useTourismAdmin } from "../_hooks/useTourismAdmin";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditTourismPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth(true);
  const router = useRouter();
  const { toast } = useToast();
  const [tourism, setTourism] = useState<Tourism | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { handleUpdate, isSubmitting } = useTourismAdmin();

  useEffect(() => {
    const fetchTourism = async () => {
      try {
        const data = await getTourismById(params.id);
        setTourism(data);
      } catch {
        toast({
          title: "Error",
          description: "Gagal memuat data destinasi wisata",
          variant: "destructive",
        });
        router.push("/admin/pariwisata");
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === "ADMIN") {
      fetchTourism();
    }
  }, [user, params.id, router, toast]);

  const onSubmit = async (values: any) => {
    const formData: Record<string, any> = {
      name: values.name,
      description: values.description,
      location: values.location,
    };

    if (values.mainImage?.[0]) {
      formData.mainImage = values.mainImage[0];
    }

    if (values.gallery?.length) {
      formData.gallery = Array.from(values.gallery);
    }

    const success = await handleUpdate(params.id, formData);
    if (success) {
      router.push("/admin/pariwisata");
    }
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
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/pariwisata")}
          className="mb-8"
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Destinasi Wisata</CardTitle>
            <CardDescription>
              Formulir untuk mengubah detail destinasi wisata
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[90px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[130px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-[100px]" />
              </div>
            ) : tourism ? (
              <>
                {isSubmitting && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-lg font-medium">Menyimpan perubahan...</p>
                    </div>
                  </div>
                )}
                <TourismForm
                  defaultValues={tourism}
                  isSubmitting={isSubmitting}
                  onSubmit={onSubmit}
                />
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Destinasi wisata tidak ditemukan
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}