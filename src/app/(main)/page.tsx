// src/app/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ArrowRight, Newspaper, Info, UserCheck, FileText, TrendingUp, Bell, Mountain } from "lucide-react"
import Link from "next/link"

// Types
interface ServiceItem {
  title: string;
  desc: string;
  link: string;
  icon: React.ElementType;
}

interface NewsItem {
  title: string;
  excerpt: string;
  date: string;
}

interface FeatureItem {
  title: string;
  icon: string;
}

// Constants
const services: ServiceItem[] = [
  { title: 'Informasi Desa', desc: 'Sejarah dan struktur perangkat desa', link: '/informasi-desa', icon: Info },
  { title: 'Tamu Wajib Lapor', desc: 'Lapor dalam 1x24 jam', link: '/tamu-wajib-lapor', icon: UserCheck },
  { title: 'Surat Menyurat', desc: 'Layanan administrasi surat', link: '/surat-menyurat', icon: FileText },
  { title: 'Transparansi', desc: 'Informasi keuangan desa', link: '/transparansi', icon: TrendingUp },
  { title: 'Pengumuman', desc: 'Informasi dan pengumuman resmi', link: '/pengumuman', icon: Bell },
  { title: 'Pariwisata Desa', desc: 'Potensi wisata Desa Tandengan', link: '/pariwisata', icon: Mountain },
];

const newsItems: NewsItem[] = [
  { title: "Pembangunan Jalan Desa Selesai", excerpt: "Proyek pembangunan jalan desa sepanjang 5 km telah rampung...", date: "2024-03-15" },
  { title: "Program Vaksinasi COVID-19 Tahap 2", excerpt: "Pemerintah desa mengumumkan jadwal vaksinasi COVID-19 tahap kedua...", date: "2024-03-10" },
  { title: "Pelatihan Digital untuk UMKM", excerpt: "Desa Tandengan mengadakan pelatihan pemasaran digital untuk UMKM lokal...", date: "2024-03-05" },
];

const featureItems: FeatureItem[] = [
  { title: "Administrasi Online", icon: "📄" },
  { title: "Informasi Terintegrasi", icon: "🌐" },
  { title: "Pengaduan Masyarakat", icon: "🗣️" }
];

// Animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

const DigitalElement: React.FC<{ delay: number }> = ({ delay }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 bg-primary rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 4,
        delay: delay,
        repeat: Infinity,
        repeatType: "loop"
      }}
    />
  )
}

export default function Home(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = ["Selamat Datang di", "Desa Tandengan", "Digital"]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [slides.length])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/10">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => (
            <DigitalElement key={i} delay={i * 0.1} />
          ))}
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
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Menuju pelayanan publik yang efisien, transparan, dan inovatif untuk kesejahteraan masyarakat desa.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Button size="lg" className="text-lg px-8 py-6">
              Berita Terkini
              <Newspaper className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="h-10 w-10 text-primary" />
        </motion.div>
      </section>

      {/* Featured Services and Announcements Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Featured Services */}
            <div className="w-full md:w-1/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Layanan Unggulan</h2>
              <div className="space-y-4">
                {featureItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-background p-4 rounded-lg shadow-md flex items-center cursor-pointer"
                  >
                    <motion.span
                      className="text-3xl mr-4"
                      initial={{ rotateY: 0 }}
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.span>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Announcements */}
            <div className="w-full md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-semibold mb-6">Pengumuman</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Penting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    <li>Jadwal vaksinasi COVID-19 tahap kedua telah diumumkan.</li>
                    <li>Pendaftaran program bantuan UMKM dibuka mulai 1 April 2024.</li>
                    <li>Penutupan jalan desa untuk perbaikan pada 10-15 April 2024.</li>
                  </ul>
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
                    <Link href={service.link} className="flex items-center text-primary hover:underline">
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
          <h2 className="text-3xl font-bold text-center mb-12">Berita Terkini</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main News */}
            <motion.div 
              className="md:col-span-2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4">{newsItems[0].title}</h3>
                  <p className="text-muted-foreground mb-4">{newsItems[0].excerpt}</p>
                  <p className="text-sm text-muted-foreground">{newsItems[0].date}</p>
                </CardContent>
              </Card>
            </motion.div>
            
            {/* Other News */}
            <div className="space-y-6">
              {newsItems.slice(1).map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{item.excerpt}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
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
  )
}