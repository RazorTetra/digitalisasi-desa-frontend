// src/app/(main)/pariwisata/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { getHeroBanner, type HeroBanner } from "@/api/heroBannerApi";
import { Tourism, getAllTourism } from "@/api/tourismApi";
import { useToast } from "@/hooks/use-toast";

const PariwisataPage: React.FC = () => {
  const [selectedDestination, setSelectedDestination] =
    useState<Tourism | null>(null);
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const [destinations, setDestinations] = useState<Tourism[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, tourismData] = await Promise.all([
          getHeroBanner(),
          getAllTourism(),
        ]);

        setHeroBanner(bannerData);
        setDestinations(tourismData);
      } catch {
        toast({
          title: "Error",
          description: "Gagal memuat data pariwisata. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner?.imageUrl ? (
            <>
              <Image
                src={heroBanner.imageUrl}
                alt="Desa Tandengan"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/60" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background">
          <div className="container mx-auto px-4 h-full flex flex-col justify-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold text-black/80 dark:text-white/80 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Wisata Desa Tandengan
            </motion.h1>
            <motion.p
              className="text-xl text-black/80 dark:text-white/80 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Jelajahi keindahan alam dan budaya Desa Tandengan yang menakjubkan
            </motion.p>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Destinasi Wisata</h2>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Belum ada destinasi wisata yang tersedia
            </div>
          ) : (
            <ScrollArea className="w-full whitespace-nowrap pb-6">
              <div className="flex gap-6">
                {destinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="w-[350px]"
                  >
                    <Card className="overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={destination.image}
                          alt={destination.name}
                          fill
                          className="object-cover transition-transform hover:scale-105"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="text-xl">
                          {destination.name}
                        </CardTitle>
                        <CardDescription>
                          {destination.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{destination.location}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedDestination(destination)}
                        >
                          Lihat Detail
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <ScrollArea className="h-full">
                  <CardHeader>
                    <div className="relative h-64 -mt-6 -mx-6 mb-4">
                      <Image
                        src={selectedDestination.image}
                        alt={selectedDestination.name}
                        fill
                        className="object-cover"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm"
                        onClick={() => setSelectedDestination(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    <div>
                      <CardTitle className="text-2xl">
                        {selectedDestination.name}
                      </CardTitle>
                      <CardDescription>
                        {selectedDestination.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="info">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">Informasi</TabsTrigger>
                        <TabsTrigger value="gallery">Galeri</TabsTrigger>
                      </TabsList>
                      <TabsContent value="info" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 my-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-primary" />
                            <span>Lokasi: {selectedDestination.location}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {selectedDestination.description}
                        </p>
                      </TabsContent>
                      <TabsContent value="gallery">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {selectedDestination.gallery.map((image, index) => (
                            <div
                              key={index}
                              className="relative aspect-square overflow-hidden rounded-lg"
                            >
                              <Image
                                src={image}
                                alt={`Gallery ${index + 1}`}
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </ScrollArea>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PariwisataPage;
