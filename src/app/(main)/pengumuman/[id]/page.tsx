// src/app/(main)/pengumuman/[id]/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { Pengumuman, Kategori, getPengumumanById, getAllKategori } from '@/api/announcementApi'

const PengumumanDetailPage: React.FC = () => {
  const [pengumuman, setPengumuman] = useState<Pengumuman | null>(null)
  const [kategori, setKategori] = useState<Kategori[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (typeof id === 'string') {
      fetchPengumuman(id)
      fetchKategori()
    }
  }, [id])

  const fetchPengumuman = async (pengumumanId: string) => {
    setIsLoading(true)
    try {
      const data = await getPengumumanById(pengumumanId)
      setPengumuman(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memuat detail pengumuman. Silakan coba lagi nanti.",
        variant: "destructive",
      })
      router.push('/pengumuman')
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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!pengumuman) {
    return <div className="flex justify-center items-center h-screen">Pengumuman tidak ditemukan</div>
  }

  const kategoriNama = kategori.find(k => k.id === pengumuman.kategoriId)?.nama || 'Tidak ada kategori'

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.push('/pengumuman')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Kembali ke Daftar Pengumuman
      </Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold">{pengumuman.judul}</CardTitle>
            <Badge variant="secondary">{kategoriNama}</Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            {formatDate(pengumuman.tanggal)}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 whitespace-pre-wrap">{pengumuman.isi}</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default PengumumanDetailPage