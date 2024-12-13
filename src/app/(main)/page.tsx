// src/app/(main)/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Info,
  UserCheck,
  FileText,
  TrendingUp,
  Bell,
  Mountain,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import {
  getAllPengumuman,
  Pengumuman as APIPengumuman,
} from "@/api/announcementApi";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getSocialMedia, SocialMedia } from "@/api/villageApi";
import { HeroSection } from "../_components/hero-section";

// Types
interface ServiceItem {
  title: string;
  desc: string;
  link: string;
  icon: React.ElementType;
  badge?: string;
}

// Constants
const services: ServiceItem[] = [
  {
    title: "Layanan Surat",
    desc: "Pengajuan surat dan dokumen secara online, proses lebih cepat",
    link: "/kirim-surat",
    icon: FileText,
    badge: "24 Jam",
  },
  {
    title: "Tamu Wajib Lapor",
    desc: "Pelaporan tamu dalam 1x24 jam untuk keamanan desa",
    link: "/tamu-wajib-lapor",
    icon: UserCheck,
    badge: "24 Jam",
  },
  {
    title: "Pariwisata",
    desc: "Jelajahi keindahan dan potensi wisata Desa Tandengan",
    link: "/pariwisata",
    icon: Mountain,
    badge: "Populer",
  },
  {
    title: "Format Surat",
    desc: "Unduh format surat yang diperlukan untuk berbagai keperluan",
    link: "/surat",
    icon: FileText,
  },
  {
    title: "Informasi Desa",
    desc: "Sejarah, visi misi, dan struktur perangkat desa",
    link: "/informasi-desa",
    icon: Info,
  },
  {
    title: "Keuangan",
    desc: "Transparansi keuangan dan penggunaan dana desa",
    link: "/keuangan",
    icon: TrendingUp,
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
  const [, setCurrentSlide] = useState(0);
  const [pengumuman, setPengumuman] = useState<APIPengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);

  const slides = ["Pelayanan Digital", "Desa Tandengan", "Modern & Efisien"];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pengumumanData, socialMediaData] = await Promise.all([
          getAllPengumuman(),
          getSocialMedia(),
        ]);

        const sortedPengumuman = pengumumanData
          .sort(
            (a, b) =>
              new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
          )
          .slice(0, 3);
        setPengumuman(sortedPengumuman);
        setSocialMedia(socialMediaData);
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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection slides={slides} />
      {/* <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0 z-0">
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
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-background to-background/60" />
          )}
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="max-w-2xl space-y-6">
            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
              >
                {slides[currentSlide]}
              </motion.h1>
            </AnimatePresence>
            <p className="text-lg md:text-xl text-muted-foreground">
              Akses layanan desa kapanpun dan dimanapun. Kami berkomitmen
              memberikan pelayanan publik yang efisien, transparan, dan inovatif
              untuk kesejahteraan masyarakat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg" asChild>
                <Link href="/kirim-surat">
                  Ajukan Surat Online
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg" asChild>
                <Link href="/informasi-desa">Tentang Desa</Link>
              </Button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const servicesSection =
                document.getElementById("layanan-section");
              servicesSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <ChevronDown className="h-8 w-8" />
          </Button>
        </motion.div>
      </section> */}

      {/* Main Services Section */}
      <section id="layanan-section" className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12">Layanan Tersedia</h2>
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link href={service.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group relative border-2 hover:border-primary">
                    {service.badge && (
                      <Badge className="absolute top-4 right-4">
                        {service.badge}
                      </Badge>
                    )}
                    <CardHeader className="space-y-4">
                      <div className="flex items-center gap-4">
                        <service.icon className="h-8 w-8 text-primary" />
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {service.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-base">
                        {service.desc}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Info Section - Pengumuman & Social Media */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Pengumuman Column */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Bell className="h-7 w-7 text-primary" />
                Pengumuman Terbaru
              </h2>

              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                      <CardContent className="py-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-5 bg-muted rounded w-3/4" />
                          <div className="h-4 bg-muted rounded w-1/4" />
                          <div className="h-4 bg-muted rounded w-full" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {pengumuman.map((item) => (
                    <Link key={item.id} href={`/pengumuman/${item.id}`}>
                      <Card className="hover:shadow-md transition-shadow hover:border-primary">
                        <CardContent className="py-6">
                          <p className="text-base text-muted-foreground mb-3">
                            {format(new Date(item.tanggal), "dd MMMM yyyy", {
                              locale: id,
                            })}
                          </p>
                          <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                            {item.judul}
                          </h3>
                          <p className="text-muted-foreground text-base line-clamp-2">
                            {item.isi}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Social Media Column */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Media Sosial</h2>
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      Gagal memuat media sosial
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {socialMedia?.map((social) => (
                      <Button
                        key={social.id}
                        variant="outline"
                        size="lg"
                        className="w-full justify-start"
                        asChild
                      >
                        <Link
                          href={social.url}
                          className="flex items-center gap-3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {social.platform}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <MapPin className="h-7 w-7 text-primary" />
            Lokasi Desa
          </h2>
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25573.01154935206!2d124.92897481630786!3d1.222489811220911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32873e7a180f6f19%3A0x92557bcdc1027cb0!2sTandengan%2C%20Kec.%20Eris%2C%20Kabupaten%20Minahasa%2C%20Sulawesi%20Utara!5e0!3m2!1sid!2sid!4v1730348024880!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
