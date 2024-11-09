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
import { useHeroBanner } from "@/hooks/use-hero-banner";

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
  const [, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: heroBanner } = useHeroBanner();
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
        const [pengumumanData, beritaData] = await Promise.all([
          getAllPengumuman(),
          getAllBerita(),
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


      {/* Maps Section */}
      <section className="py-16 px-0 sm:px-0">
        {" "}
        {/* Menghapus padding di sisi kanan & kiri */}
        <div className="max-w-[100vw]">
          {" "}
          {/* Container full width */}
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Lokasi Desa
          </motion.h2>
          <motion.div
            className="w-full shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25573.01154935206!2d124.92897481630786!3d1.222489811220911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32873e7a180f6f19%3A0x92557bcdc1027cb0!2sTandengan%2C%20Kec.%20Eris%2C%20Kabupaten%20Minahasa%2C%20Sulawesi%20Utara!5e0!3m2!1sid!2sid!4v1730348024880!5m2!1sid!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
