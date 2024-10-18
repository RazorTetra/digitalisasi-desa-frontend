// src/app/(main)/berita/page.tsx
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Clock, ArrowRight } from 'lucide-react'

// TODO: Ganti dengan data aktual dari backend
const dummyBerita = [
  { id: 1, judul: "Pembangunan Taman Kota Dimulai", ringkasan: "Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini...", tanggal: "2024-07-01", kategori: "Pembangunan", gambar: "/images/berita/taman-kota.jpg" },
  { id: 2, judul: "Festival Budaya Tahunan Sukses Digelar", ringkasan: "Festival Budaya Tahunan ke-5 berhasil menarik ribuan pengunjung dari berbagai daerah...", tanggal: "2024-06-28", kategori: "Budaya", gambar: "/images/berita/festival-budaya.jpg" },
  { id: 3, judul: "Prestasi Gemilang Atlet Lokal di Kejuaraan Nasional", ringkasan: "Tim atlet dari desa kita berhasil meraih 3 medali emas dalam Kejuaraan Olahraga Nasional...", tanggal: "2024-06-25", kategori: "Olahraga", gambar: "/images/berita/atlet-lokal.jpg" },
  { id: 4, judul: "Program Pelatihan Digital untuk UMKM", ringkasan: "Desa mengadakan program pelatihan digital untuk membantu UMKM lokal go online...", tanggal: "2024-06-22", kategori: "Ekonomi", gambar: "/images/berita/pelatihan-umkm.jpg" },
  { id: 5, judul: "Kunjungan Gubernur ke Desa Kita", ringkasan: "Gubernur melakukan kunjungan kerja ke desa kita untuk meninjau langsung perkembangan program...", tanggal: "2024-06-20", kategori: "Pemerintahan", gambar: "/images/berita/kunjungan-gubernur.jpg" },
]

const BeritaPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Semua')

  // TODO: Ganti dengan data aktual dari backend
  const categories = ['Semua', 'Pembangunan', 'Budaya', 'Olahraga', 'Ekonomi', 'Pemerintahan']

  const filteredBerita = dummyBerita.filter(berita =>
    (activeTab === 'Semua' || berita.kategori === activeTab) &&
    (berita.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
     berita.ringkasan.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Berita Terkini</h1>

      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Cari berita..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      <Tabs defaultValue="Semua" className="mb-8">
        <TabsList className="flex flex-wrap justify-center">
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveTab(category)}
              className="m-1"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBerita.map((berita, index) => (
          <motion.div
            key={berita.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={`/berita/${berita.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={berita.gambar}
                  alt={berita.judul}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold">{berita.judul}</CardTitle>
                    <Badge variant="secondary">{berita.kategori}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="mr-2 h-4 w-4" />
                    {new Date(berita.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{berita.ringkasan}</p>
                  <Button variant="link" className="p-0 flex items-center">
                    Baca selengkapnya
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default BeritaPage

// TODO: Implementasi fitur untuk admin agar dapat mengelola berita secara dinamis
// Ini dapat dilakukan dengan menambahkan halaman admin dan API endpoints untuk CRUD operasi pada berita