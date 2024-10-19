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
import { AlertCircle, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast"
import { Pengumuman, Kategori, getAllPengumuman, getAllKategori } from '@/api/announcementApi'

const ITEMS_PER_PAGE = 5

const PengumumanPage: React.FC = () => {
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([])
  const [kategori, setKategori] = useState<Kategori[]>([])
  const [filteredPengumuman, setFilteredPengumuman] = useState<Pengumuman[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchPengumuman()
    fetchKategori()
  }, [])

  const fetchPengumuman = async () => {
    setIsLoading(true)
    try {
      const data = await getAllPengumuman()
      setPengumuman(data)
      setFilteredPengumuman(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat pengumuman. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchKategori = async () => {
    try {
      const data = await getAllKategori()
      setKategori(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat kategori. Silakan coba lagi nanti.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    const filtered = pengumuman.filter(item =>
      (item.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.isi.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeTab === 'all' || item.kategoriId === activeTab)
    )
    setFilteredPengumuman(filtered)
    setCurrentPage(1)
  }, [searchTerm, activeTab, pengumuman])

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  const paginatedPengumuman = filteredPengumuman.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const totalPages = Math.ceil(filteredPengumuman.length / ITEMS_PER_PAGE)

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="flex flex-wrap justify-center">
          <TabsTrigger value="all" className="m-1">
            Semua
          </TabsTrigger>
          {kategori.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="m-1"
            >
              {category.nama}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ScrollArea className="h-[600px] rounded-md border p-4">
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <AlertCircle className="h-16 w-16 text-gray-400 animate-spin" />
            </div>
          ) : paginatedPengumuman.length > 0 ? (
            paginatedPengumuman.map((item) => (
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
                      <Badge variant="secondary">
                        {kategori.find(k => k.id === item.kategoriId)?.nama || 'Tidak ada kategori'}
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(item.tanggal)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.isi.substring(0, 150)}...</p>
                    <Link href={`/pengumuman/${item.id}`}>
                      <Button variant="link" className="mt-4 p-0">Baca selengkapnya</Button>
                    </Link>
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>{currentPage} dari {totalPages}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default PengumumanPage