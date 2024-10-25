/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/admin/pariwisata/_hooks/useTourismAdmin.ts
import { useState, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Tourism,
  getAllTourism, 
  createTourism, 
  updateTourism, 
  deleteTourism,
  isApiError,
  isFileTypeError,
  type CreateTourismData,
  type UpdateTourismData 
} from '@/api/tourismApi';

export const useTourismAdmin = () => {
  const [items, setItems] = useState<Tourism[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Gunakan useRef untuk menyimpan status fetch yang sedang berjalan
  const fetchInProgress = useRef(false);

  const fetchTourism = useCallback(async (force = false) => {
    // Jika sudah diinisialisasi dan tidak dipaksa refresh, skip fetch
    if (isInitialized && !force) return;
    
    // Jika sedang fetch, skip
    if (fetchInProgress.current) return;

    try {
      fetchInProgress.current = true;
      setIsLoading(true);
      const data = await getAllTourism();
      setItems(data);
      setIsInitialized(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat data pariwisata. Silakan coba lagi nanti.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [isInitialized, toast]);

  const handleCreate = async (data: CreateTourismData) => {
    setIsSubmitting(true);
    try {
      const newTourism = await createTourism(data);
      setItems(prev => [...prev, newTourism]);
      toast({
        title: "Berhasil",
        description: "Destinasi wisata berhasil ditambahkan",
      });
      return true;
    } catch (error) {
      if (isFileTypeError(error)) {
        toast({
          title: "Error",
          description: "Format file tidak didukung. Gunakan .jpg, .png, atau .webp",
          variant: "destructive",
        });
      } else if (isApiError(error)) {
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal menambahkan destinasi wisata",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateTourismData) => {
    setIsSubmitting(true);
    try {
      const updatedTourism = await updateTourism(id, data);
      setItems(prev => prev.map(item => 
        item.id === id ? updatedTourism : item
      ));
      toast({
        title: "Berhasil",
        description: "Destinasi wisata berhasil diperbarui",
      });
      return true;
    } catch (error) {
      if (isFileTypeError(error)) {
        toast({
          title: "Error",
          description: "Format file tidak didukung. Gunakan .jpg, .png, atau .webp",
          variant: "destructive",
        });
      } else if (isApiError(error)) {
        toast({
          title: "Error",
          description: error.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal memperbarui destinasi wisata",
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTourism(id);
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Berhasil",
        description: "Destinasi wisata berhasil dihapus",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus destinasi wisata",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    items,
    isLoading,
    isSubmitting,
    isInitialized,
    fetchTourism,
    handleCreate,
    handleUpdate,
    handleDelete
  };
};