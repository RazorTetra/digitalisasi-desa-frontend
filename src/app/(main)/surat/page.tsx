// src/app/(main)/surat/page.tsx
"use client"

import React from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FileDown, FileText, LogIn } from 'lucide-react'
import Link from 'next/link'

// Dummy data untuk contoh surat
const contohSurat = [
  { id: 1, nama: "Surat Keterangan Belum Pernah Kawin", file: "/surat/belum-kawin.pdf" },
  { id: 2, nama: "Surat Keterangan Perbedaan Nama", file: "/surat/perbedaan-nama.pdf" },
  { id: 3, nama: "Surat Keterangan Berkelakuan Baik", file: "/surat/berkelakuan-baik.pdf" },
  { id: 4, nama: "Surat Keterangan Berdomisili", file: "/surat/berdomisili.pdf" },
  { id: 5, nama: "Surat Keterangan Kurang Mampu", file: "/surat/kurang-mampu.pdf" },
  { id: 6, nama: "Surat Keterangan Usaha", file: "/surat/keterangan-usaha.pdf" },
]

const SuratPage: React.FC = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Layanan Administrasi Surat</h1>

      {!user && (
        <Alert className="mb-8">
          <AlertTitle>Buat Akun untuk Mengajukan Permohonan Surat</AlertTitle>
          <AlertDescription>
            Untuk mengajukan permohonan surat, Anda perlu memiliki akun. 
            <Link href="/register" className="ml-2 underline">
              Daftar sekarang
            </Link> atau 
            <Link href="/login" className="ml-2 underline">
              Login
            </Link> jika sudah memiliki akun.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Contoh Surat</CardTitle>
            <CardDescription>
              Unduh contoh surat untuk referensi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {contohSurat.map((surat) => (
                <li key={surat.id} className="flex justify-between items-center">
                  <span>{surat.nama}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={surat.file} download>
                      <FileDown className="mr-2 h-4 w-4" />
                      Unduh
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ajukan Permohonan Surat</CardTitle>
            <CardDescription>
              {user 
                ? "Pilih jenis surat yang ingin Anda ajukan"
                : "Login untuk mengajukan permohonan surat"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user ? (
              <ul className="space-y-4">
                {contohSurat.map((surat) => (
                  <li key={surat.id}>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      {surat.nama}
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center">
                <p className="mb-4">Anda perlu login untuk mengajukan permohonan surat.</p>
                <Button asChild>
                  <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Penting</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2">
            <li>Pastikan data yang Anda masukkan saat mengajukan permohonan surat adalah benar dan akurat.</li>
            <li>Proses pengajuan surat dapat memakan waktu 1-3 hari kerja.</li>
            <li>Anda akan menerima notifikasi melalui email saat surat Anda siap diambil di kantor desa.</li>
            <li>Jika ada pertanyaan, silakan hubungi kantor desa di (0123) 456-7890.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default SuratPage

// TODO: Implementasi fitur untuk admin agar dapat mengelola pengumuman secara dinamis
// Ini dapat dilakukan dengan menambahkan halaman admin dan API endpoints untuk CRUD operasi pada pengumuman