// src/app/(main)/berita/[slug]/page.tsx
"use client"

import React from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Facebook, Twitter, Linkedin, Clock, User } from 'lucide-react'

// TODO: Ganti dengan data aktual dari backend
const dummyBeritaDetail = {
  id: 1,
  judul: "Pembangunan Taman Kota Dimulai",
  isi: `<p>Proyek pembangunan taman kota yang telah lama ditunggu akhirnya dimulai hari ini. Taman seluas 5 hektar ini akan menjadi pusat rekreasi baru bagi warga kota.</p>
        <p>Fasilitas yang akan dibangun meliputi:</p>
        <ul>
          <li>Area bermain anak</li>
          <li>Jogging track</li>
          <li>Taman bunga</li>
          <li>Amphitheater outdoor</li>
          <li>Danau buatan</li>
        </ul>
        <p>Walikota menyatakan bahwa proyek ini diharapkan selesai dalam waktu 12 bulan dan akan menjadi landmark baru kota kita.</p>`,
  tanggal: "2024-07-01",
  kategori: "Pembangunan",
  gambar: "/images/berita/taman-kota.jpg",
  penulis: "John Doe",
  avatarPenulis: "/images/avatars/john-doe.jpg"
}

const BeritaDetailPage: React.FC = () => {
  const params = useParams()
  // TODO: Fetch berita berdasarkan slug
  console.log(params.slug)

  const berita = dummyBeritaDetail

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <Image
            src={berita.gambar}
            alt={berita.judul}
            width={1200}
            height={600}
            className="w-full h-[400px] object-cover"
          />
          <CardHeader>
            <div className="flex flex-wrap justify-between items-center mb-4">
              <Badge variant="secondary" className="text-sm">{berita.kategori}</Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                {new Date(berita.tanggal).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <CardTitle className="text-3xl font-bold mb-4">{berita.judul}</CardTitle>
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={berita.avatarPenulis} alt={berita.penulis} />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{berita.penulis}</p>
                <p className="text-sm text-gray-500">Penulis</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: berita.isi }}
            />
            <div className="mt-8 pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Bagikan Berita Ini</h3>
              <div className="flex space-x-4">
                <Button variant="outline" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default BeritaDetailPage

// TODO: Implementasi fitur komentar untuk meningkatkan engagement
// TODO: Tambahkan rekomendasi berita terkait di bagian bawah halaman
// TODO: Implementasi sistem rating atau reaksi pembaca (seperti clap di Medium)