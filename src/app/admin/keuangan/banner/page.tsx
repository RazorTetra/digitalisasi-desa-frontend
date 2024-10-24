// src/app/admin/keuangan/banner/page.tsx

"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/hooks/useAuth';
import { Loader2, ImageIcon } from 'lucide-react';
import { getFinanceBanner, updateFinanceBanner, FinanceBanner } from '@/api/financeApi';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function FinanceBannerPage() {
  const { user } = useAuth(true);
  const { toast } = useToast();
  const [banner, setBanner] = useState<FinanceBanner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBanner = useCallback(async () => {
    try {
      const data = await getFinanceBanner();
      setBanner(data);
      setError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal memuat banner';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Gagal memuat banner. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchBanner();
  }, [fetchBanner]);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'File harus berupa gambar (JPG, PNG, atau WebP)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'Ukuran file tidak boleh lebih dari 5MB';
    }
    return null;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const updatedBanner = await updateFinanceBanner(formData);
      setBanner(updatedBanner);
      
      toast({
        title: "Sukses",
        description: "Banner berhasil diperbarui",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengunggah banner';
      setError(errorMessage);
      toast({
        title: "Error",
        description: "Gagal mengunggah banner. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Banner Keuangan</CardTitle>
            <CardDescription>
              Upload banner untuk halaman keuangan desa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview Banner */}
            {isLoading ? (
              <div className="flex justify-center items-center h-[400px] bg-muted rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : banner?.imageUrl ? (
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={banner.imageUrl}
                  alt="Banner Keuangan"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg">
                <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Belum ada banner</p>
              </div>
            )}

            {/* Upload Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="banner-upload">Upload Banner Baru</Label>
                <div 
                  className="mt-2 flex flex-col items-center gap-4 p-6 border-2 border-dashed rounded-lg hover:border-primary cursor-pointer"
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk mengunggah banner baru
                  </p>
                  {isUploading && (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  )}
                </div>
              </div>
              <Input
                id="banner-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <p className="text-sm text-muted-foreground">
                Format yang didukung: JPG, PNG, WebP. Maksimal 5MB.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}