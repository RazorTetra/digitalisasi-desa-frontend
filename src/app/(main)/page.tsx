// src/app/(main)/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ArrowRight,
  Newspaper,
  Info,
  UserCheck,
  FileText,
  TrendingUp,
  Bell,
  Mountain,
} from "lucide-react";
import Link from "next/link";
import {
  getAllPengumuman,
  Pengumuman as APIPengumuman,
} from "@/api/announcementApi";
import { Berita, getAllBerita } from "@/api/beritaApi";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { getHeroBanner, type HeroBanner } from "@/api/heroBannerApi";

// Types
interface ServiceItem {
  title: string;
  desc: string;
  link: string;
  icon: React.ElementType;
}

// Constants
const services: ServiceItem[] = [
  {
    title: "Informasi Desa",
    desc: "Sejarah dan struktur perangkat desa",
    link: "/informasi-desa",
    icon: Info,
  },
  {
    title: "Tamu Wajib Lapor",
    desc: "Lapor dalam 1x24 jam",
    link: "/tamu-wajib-lapor",
    icon: UserCheck,
  },
  {
    title: "Surat Menyurat",
    desc: "Layanan administrasi surat",
    link: "/surat",
    icon: FileText,
  },
  {
    title: "Keuangan",
    desc: "Informasi keuangan desa",
    link: "/keuangan",
    icon: TrendingUp,
  },
  {
    title: "Pengumuman",
    desc: "Informasi dan pengumuman resmi",
    link: "/pengumuman",
    icon: Bell,
  },
  {
    title: "Pariwisata Desa",
    desc: "Potensi wisata Desa Tandengan",
    link: "/pariwisata",
    icon: Mountain,
  },
];

// Animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Home(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [pengumuman, setPengumuman] = useState<APIPengumuman[]>([]);
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [heroBanner, setHeroBanner] = useState<HeroBanner | null>(null);
  const slides = ["Selamat Datang di", "Desa Tandengan", "Digital"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both pengumuman and berita concurrently
        const [pengumumanData, beritaData, bannerData] = await Promise.all([
          getAllPengumuman(),
          getAllBerita(),
          getHeroBanner(),
        ]);

        // Sort and slice pengumuman
        const sortedPengumuman = pengumumanData
          .sort(
            (a, b) =>
              new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
          )
          .slice(0, 3);
        setPengumuman(sortedPengumuman);

        // Sort and slice berita
        const sortedBerita = beritaData
          .sort(
            (a, b) =>
              new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
          )
          .slice(0, 3);
        setBerita(sortedBerita);
        setHeroBanner(bannerData);
      } catch (err) {
        setError("Gagal memuat data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/10">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {heroBanner?.imageUrl ? (
            <>
              <Image
                src={heroBanner.imageUrl}
                alt="Desa Tandengan"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/90" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/60" />
          )}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentSlide}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-primary"
            >
              {slides[currentSlide]}
            </motion.h1>
          </AnimatePresence>
          <motion.p
            className="text-xl md:text-2xl font-bold mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Menuju pelayanan publik yang efisien, transparan, dan inovatif untuk
            kesejahteraan masyarakat desa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              onClick={() => {
                const newsSection = document.querySelector(".bg-secondary");
                newsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Layanan
              <Newspaper className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Bottom Shadow/Gradient untuk transisi halus */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Featured Services and Announcements Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex">
            {/* Announcements */}
            <div className="w-full">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">
                Pengumuman
              </h2>
              <Card>
                <CardContent className="mt-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-muted rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <ul className="space-y-4">
                      {pengumuman.map((item) => (
                        <li key={item.id}>
                          <Link href={`/pengumuman/${item.id}`}>
                            <h4 className="font-semibold hover:text-primary transition-colors">
                              {item.judul}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(item.tanggal), "dd MMMM yyyy", {
                                locale: id,
                              })}
                            </p>
                            <p className="line-clamp-2 text-muted-foreground">
                              {item.isi}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Layanan Kami</h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{service.title}</CardTitle>
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardDescription>{service.desc}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow" />
                  <div className="p-6 pt-0">
                    <Link
                      href={service.link}
                      className="flex items-center text-primary hover:underline"
                    >
                      Lihat Detail
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Berita Terkini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main News */}
            {berita.length > 0 && (
              <motion.div
                className="md:col-span-2"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/berita/${berita[0].slug}`}>
                  <Card className="h-full overflow-hidden">
                    <div className="relative h-64">
                      {berita[0].gambarUrl && (
                        <>
                          <Image
                            src={berita[0].gambarUrl}
                            alt={berita[0].judul}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 66vw"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                          <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                            <h3 className="text-2xl font-semibold mb-2 hover:text-primary/90 transition-colors">
                              {berita[0].judul}
                            </h3>
                            <p className="text-white/80 mb-2 line-clamp-2">
                              {berita[0].ringkasan}
                            </p>
                            <p className="text-sm text-white/60">
                              {format(
                                new Date(berita[0].tanggal),
                                "dd MMMM yyyy",
                                { locale: id }
                              )}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Berita lainnya */}
            <div className="space-y-6">
              {berita.slice(1).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={`/berita/${item.slug}`}>
                    <Card className="overflow-hidden">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="relative h-24">
                          <Image
                            src={item.gambarUrl}
                            alt={item.judul}
                            fill
                            className="object-cover rounded-l"
                            sizes="(max-width: 768px) 33vw, 20vw"
                          />
                        </div>
                        <div className="col-span-2 p-4">
                          <h4 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                            {item.judul}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(item.tanggal), "dd MMMM yyyy", {
                              locale: id,
                            })}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
              {loading && (
                <div className="space-y-6">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <Card>
                        <div className="grid grid-cols-3 gap-4 p-4">
                          <div className="bg-muted h-24 rounded" />
                          <div className="col-span-2 space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link href="/berita">
              <Button size="lg">
                Lihat Semua Berita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
