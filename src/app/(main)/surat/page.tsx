// src/app/(main)/surat/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileDown, Loader2, PhoneCall, Mail, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import {
  getAllFormatSurat,
  FormatSurat,
  trackFormatSuratDownload,
} from "@/api/suratApi";

const KontakInfo = [
  { icon: <PhoneCall className="h-4 w-4" />, text: "(0123) 456-7890" },
  {
    icon: <Mail className="h-4 w-4" />,
    text: "administrasi@desatandengan.go.id",
  },
  { icon: <MapPin className="h-4 w-4" />, text: "Jl. Desa Tandengan No. 123" },
];

const InformasiPenting = [
  "Pastikan mengisi format surat dengan data yang benar dan valid",
  "Surat yang memerlukan legalisasi harus dibawa ke kantor desa",
  "Dokumen dapat diisi secara digital atau dicetak",
  "Untuk beberapa jenis surat mungkin diperlukan dokumen pendukung tambahan",
  "Jika ada kesulitan dalam pengisian, silakan hubungi kantor desa",
];

const SuratPage: React.FC = () => {
  const [formatSurat, setFormatSurat] = useState<FormatSurat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFormatSurat();
  }, []);

  const fetchFormatSurat = async () => {
    try {
      const data = await getAllFormatSurat();
      setFormatSurat(data);
      setError(null);
    } catch {
      setError("Gagal memuat daftar format surat. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (surat: FormatSurat) => {
    try {
      // Optimistic update
      setFormatSurat((current) =>
        current.map((item) =>
          item.id === surat.id
            ? { ...item, totalDownloads: (item.totalDownloads || 0) + 1 }
            : item
        )
      );

      // Track download
      await trackFormatSuratDownload(surat.id);

      // Buka link download
      window.open(surat.downloadUrl, "_blank");

      // Refresh data untuk memastikan akurasi
      await fetchFormatSurat();
    } catch (error) {
      console.error("Error tracking download:", error);

      // Rollback optimistic update jika gagal
      setFormatSurat((current) =>
        current.map((item) =>
          item.id === surat.id
            ? { ...item, totalDownloads: (item.totalDownloads || 0) - 1 }
            : item
        )
      );

      // Tetap buka link download meskipun tracking gagal
      window.open(surat.downloadUrl, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center">
        Layanan Administrasi Surat
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Format Surat */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Format Surat</CardTitle>
              <CardDescription>
                Unduh format surat yang dibutuhkan di bawah ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : formatSurat.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Belum ada format surat yang tersedia
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <ul className="space-y-4">
                    {formatSurat.map((surat) => (
                      <motion.li
                        key={surat.id}
                        className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <div>
                          <span className="font-medium">{surat.nama}</span>
                          {typeof surat.totalDownloads === "number" && (
                            <p className="text-sm text-muted-foreground">
                              Telah diunduh {surat.totalDownloads} kali
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(surat)}
                          className="flex items-center"
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Unduh
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Informasi Kontak */}
        <div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Kontak Kami</CardTitle>
              <CardDescription>
                Hubungi kami jika ada pertanyaan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {KontakInfo.map((info, index) => (
                  <li
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    {info.icon}
                    <span>{info.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi Penting</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-sm">
                {InformasiPenting.map((info, index) => (
                  <li key={index}>{info}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SuratPage;
