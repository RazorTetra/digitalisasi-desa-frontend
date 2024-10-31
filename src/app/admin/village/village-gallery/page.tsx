/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/admin/village/village-gallery/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import {
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  GalleryImage,
} from "@/api/villageApi";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Trash2, ImageIcon, Upload, Loader2, X } from "lucide-react";

const AdminVillageGalleryPage: React.FC = () => {
  const { user } = useAuth(true);
  const { toast } = useToast();
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Fetch gallery data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const galleryData = await getGallery();
        setGallery(galleryData);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal memuat data galeri. Silakan coba lagi.",
        });
        setError("Gagal memuat data galeri. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // Dropzone configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // Upload image
      const formData = new FormData();
      formData.append("image", file);

      setIsUploading(true);
      try {
        const newImage = await addGalleryImage(formData);
        setGallery((prev) => [...prev, newImage]);
        setError(null);
        toast({
          title: "Berhasil!",
          description: "Foto berhasil diunggah",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal mengunggah gambar. Silakan coba lagi.",
        });
        setError("Gagal mengunggah gambar");
      } finally {
        setIsUploading(false);
        setPreview(null);
        URL.revokeObjectURL(objectUrl);
      }
    },
  });

  // Delete image handler
  const handleDeleteImage = async (id: string) => {
    try {
      await deleteGalleryImage(id);
      setGallery(gallery.filter((img) => img.id !== id));
      setError(null);
      toast({
        title: "Berhasil!",
        description: "Foto berhasil dihapus",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus gambar. Silakan coba lagi.",
      });
      setError("Gagal menghapus gambar");
    } finally {
      setDeleteId(null);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>
            Anda tidak memiliki akses ke halaman ini.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Galeri Desa</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Foto Desa</CardTitle>
          <CardDescription>
            Unggah foto desa dalam format JPG, PNG, atau WEBP. Maksimal 5MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/10" : "border-border",
              isUploading && "pointer-events-none opacity-50"
            )}
          >
            <Input {...getInputProps()} />
            {isUploading ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Mengunggah foto...</p>
              </div>
            ) : preview ? (
              <div className="relative mx-auto w-48 h-48">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  className="object-contain rounded-lg"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4">
                <Upload className="h-8 w-8 text-primary" />
                <p>
                  {isDragActive ? (
                    "Letakkan foto di sini"
                  ) : (
                    <>
                      Drag & drop foto di sini, atau{" "}
                      <span className="text-primary">pilih foto</span>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Koleksi Foto</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : gallery.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Belum ada foto dalam galeri
              </p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              layout
            >
              <AnimatePresence>
                {gallery.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="relative w-full h-48 mb-4 group">
                          <Image
                            src={image.imageUrl}
                            alt={image.description || "Gambar desa"}
                            fill
                            priority={index < 2} // Add priority to first 2 images
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                            className="rounded-lg object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(image.id)}
                          className="w-full"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Hapus
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Foto</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus foto ini? Tindakan ini tidak
              dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDeleteImage(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminVillageGalleryPage;
