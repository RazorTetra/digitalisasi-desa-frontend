// src/app/(main)/berita/[slug]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import { Berita, getBeritaBySlug } from "@/api/beritaApi";
import Link from "next/link";

export default function BeritaDetailPage() {
  const params = useParams();
  const { toast } = useToast();
  const [berita, setBerita] = useState<Berita | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBerita = async () => {
      try {
        if (typeof params.slug !== "string") return;
        const data = await getBeritaBySlug(params.slug);
        setBerita(data);
      } catch {
        toast({
          title: "Error",
          description: "Gagal memuat berita. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBerita();
  }, [params.slug, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-96 bg-muted rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Berita tidak ditemukan</AlertDescription>
        </Alert>
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
        <Link href="/berita">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Daftar Berita
          </Button>
        </Link>

        <Card>
          <div className="relative w-full aspect-video">
            <Image
              src={berita.gambarUrl}
              alt={berita.judul}
              fill
              className="object-cover rounded-t-lg"
              priority
            />
          </div>

          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              {berita.kategori.map((kat) => (
                <span
                  key={kat.id}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                >
                  {kat.nama}
                </span>
              ))}
            </div>

            <h1 className="text-3xl font-bold mb-4">{berita.judul}</h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{berita.penulis}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(berita.tanggal), "dd MMMM yyyy", {
                      locale: id,
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                {berita.ringkasan}
              </p>
              <div
                className="mt-6"
                dangerouslySetInnerHTML={{ __html: berita.isi }}
              />
            </div>

            {/* Author Info */}
            <div className="mt-8 pt-8 border-t">
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{berita.penulis}</p>
                  <p className="text-sm text-muted-foreground">
                    Penulis di Desa Tandengan Digital
                  </p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="mt-8 pt-8 border-t text-sm text-muted-foreground">
              <p>
                Dipublikasikan:{" "}
                {format(new Date(berita.createdAt), "dd MMMM yyyy HH:mm", {
                  locale: id,
                })}
              </p>
              <p>
                Diperbarui:{" "}
                {format(new Date(berita.updatedAt), "dd MMMM yyyy HH:mm", {
                  locale: id,
                })}
              </p>
              <div className="mt-2">
                Kategori:{" "}
                {berita.kategori.map((kat, index) => (
                  <span key={kat.id}>
                    {index > 0 && ", "}
                    <Link
                      href={`/berita?kategori=${kat.slug}`}
                      className="text-primary hover:underline"
                    >
                      {kat.nama}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Link href="/berita">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Berita
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
