// src/app/(main)/berita/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Search, Clock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Berita, KategoriBerita, getAllBerita, getAllKategori } from '@/api/beritaApi';

const ITEMS_PER_PAGE = 9;

export default function BeritaPage() {
  const { toast } = useToast();
  const [berita, setBerita] = useState<Berita[]>([]);
  const [kategori, setKategori] = useState<KategoriBerita[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [beritaData, kategoriData] = await Promise.all([
          getAllBerita(),
          getAllKategori()
        ]);
        setBerita(beritaData);
        setKategori(kategoriData);
      } catch  {
        toast({
          title: "Error",
          description: "Gagal memuat data berita. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const filteredBerita = useMemo(() => {
    return berita.filter(item => {
      const matchesSearch = item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ringkasan.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesKategori = !selectedKategori || 
        item.kategori.some(k => k.id === selectedKategori);
      return matchesSearch && matchesKategori;
    });
  }, [berita, searchTerm, selectedKategori]);

  const paginatedBerita = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBerita.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBerita, currentPage]);

  const totalPages = Math.ceil(filteredBerita.length / ITEMS_PER_PAGE);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
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
        <h1 className="text-4xl font-bold mb-8 text-center">Berita Terkini</h1>

        <div className="mb-8 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari berita..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>
            <Tabs 
              value={selectedKategori || 'all'} 
              onValueChange={(value) => {
                setSelectedKategori(value === 'all' ? null : value);
                setCurrentPage(1);
              }}
            >
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                {kategori.map((kat) => (
                  <TabsTrigger key={kat.id} value={kat.id}>
                    {kat.nama}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Berita Grid */}
          {paginatedBerita.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBerita.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/berita/${item.slug}`}>
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <div className="relative aspect-video">
                        <Image
                          src={item.gambarUrl}
                          alt={item.judul}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.kategori.map((kat) => (
                            <span
                              key={kat.id}
                              className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                            >
                              {kat.nama}
                            </span>
                          ))}
                        </div>
                        <CardTitle className="line-clamp-2">{item.judul}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-2 h-4 w-4" />
                          {format(new Date(item.tanggal), 'dd MMMM yyyy', { locale: id })}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {item.ringkasan}
                        </p>
                        <Button variant="link" className="px-0">
                          Baca selengkapnya
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Tidak ada berita yang ditemukan
              </AlertDescription>
            </Alert>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Sebelumnya
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}