// src/app/(main)/pengumuman/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, Calendar, Search } from 'lucide-react'

// TODO: Ganti dengan data aktual dari backend
const dummyPengumuman = [
  { id: 1, judul: "Jadwal Vaksinasi COVID-19", isi: "Vaksinasi COVID-19 tahap kedua akan dilaksanakan pada tanggal 15 Juli 2024...", tanggal: "2024-07-01", kategori: "Kesehatan" },
  { id: 2, judul: "Pembukaan Pendaftaran UMKM", isi: "Pendaftaran UMKM untuk program bantuan modal usaha dibuka mulai 1 Agustus 2024...", tanggal: "2024-07-15", kategori: "Ekonomi" },
  { id: 3, judul: "Perayaan HUT Desa", isi: "Dalam rangka HUT Desa ke-50, akan diadakan berbagai lomba dan kegiatan mulai tanggal 10 Agustus 2024...", tanggal: "2024-07-20", kategori: "Acara" },
  { id: 4, judul: "Pembangunan Jembatan", isi: "Proyek pembangunan jembatan penghubung antar dusun akan dimulai pada 1 September 2024...", tanggal: "2024-08-01", kategori: "Infrastruktur" },
  { id: 5, judul: "Pelatihan Keterampilan Digital", isi: "Pelatihan keterampilan digital untuk pemuda desa akan diadakan pada 5-7 September 2024...", tanggal: "2024-08-15", kategori: "Pendidikan" },
]

const PengumumanPage: React.FC = () => {
  const [pengumuman] = useState(dummyPengumuman)
  const [filteredPengumuman, setFilteredPengumuman] = useState(dummyPengumuman)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('Semua')

  // TODO: Ganti dengan data aktual dari backend
  const categories = ['Semua', 'Kesehatan', 'Ekonomi', 'Acara', 'Infrastruktur', 'Pendidikan']

  useEffect(() => {
    const filtered = pengumuman.filter(item =>
      item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPengumuman(activeTab === 'Semua' ? filtered : filtered.filter(item => item.kategori === activeTab))
  }, [searchTerm, activeTab, pengumuman])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Pengumuman Desa</h1>

      <div className="mb-8 relative">
        <Input
          type="text"
          placeholder="Cari pengumuman..."
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

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <AnimatePresence>
          {filteredPengumuman.length > 0 ? (
            filteredPengumuman.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold">{item.judul}</CardTitle>
                      <Badge variant="secondary">{item.kategori}</Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(item.tanggal)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.isi}</p>
                    <Button variant="link" className="mt-4 p-0">Baca selengkapnya</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full"
            >
              <AlertCircle className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-xl font-semibold text-gray-600">Tidak ada pengumuman ditemukan</p>
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
}

export default PengumumanPage

// TODO: Implementasi fitur untuk admin agar dapat mengelola pengumuman secara dinamis
// Ini dapat dilakukan dengan menambahkan halaman admin dan API endpoints untuk CRUD operasi pada pengumuman