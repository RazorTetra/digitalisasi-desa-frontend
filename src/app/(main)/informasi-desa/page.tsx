// src/app/(main)/informasi-desa/page.tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getVillageInfo,
  getVillageStructure,
  getGallery,
  getSocialMedia,
} from "@/api/villageApi";
import type {
  VillageInfo,
  VillageStructure,
  GalleryImage,
  SocialMedia,
} from "@/api/villageApi";
import { OrganizationChart } from "./_components/OrganizationChart";
import { GalleryView } from "./_components/GalleryView";
import { SocialMediaCard } from "./_components/SocialMediaCard";

const InformasiDesaPage: React.FC = () => {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null);
  const [structures, setStructures] = useState<VillageStructure[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData, structureData, galleryData, socialMediaData] =
          await Promise.all([
            getVillageInfo(),
            getVillageStructure(),
            getGallery(),
            getSocialMedia(),
          ]);
        setVillageInfo(infoData);
        setStructures(structureData);
        setGallery(galleryData);
        setSocialMedia(socialMediaData);
      } catch (err) {
        setError(
          "Terjadi kesalahan saat memuat data. Silakan coba lagi nanti."
        );
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-12" />
        <div className="space-y-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center text-primary"
      >
        Informasi Desa Tandengan
      </motion.h1>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="structure">Struktur</TabsTrigger>
          <TabsTrigger value="gallery">Galeri</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sejarah Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {villageInfo?.history || "Belum ada informasi sejarah desa."}
              </p>
            </CardContent>
          </Card>

          <SocialMediaCard socialMedia={socialMedia} />
        </TabsContent>

        <TabsContent value="structure">
          <OrganizationChart structures={structures} />
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Galeri Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <GalleryView images={gallery} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformasiDesaPage;