// src/app/informasi-desa/page.tsx
"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'

// Data dummy untuk struktur desa
const strukturDesa = [
  { jabatan: "Kepala Desa", nama: "Bpk. John Doe" },
  { jabatan: "Sekretaris Desa", nama: "Ibu Jane Smith" },
  { jabatan: "Bendahara Desa", nama: "Bpk. Michael Johnson" },
  { jabatan: "Kepala Urusan Pemerintahan", nama: "Ibu Emily Brown" },
  { jabatan: "Kepala Urusan Pembangunan", nama: "Bpk. David Wilson" },
]

const InformasiDesaPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Informasi Desa Tandengan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Struktur Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {strukturDesa.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.jabatan}</AccordionTrigger>
                  <AccordionContent>{item.nama}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sejarah Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dibentuknya sebuah wanua (atau wilayah pemukiman) di lokasi Desa Tandengan saat ini bermula dari kedatangan tiga orang bernama Oroh, Tumonggor, dan Lumempow dari daerah Minawanua (sekarang daerah Kelurahan Toulour di Kecamatan Tondano Timur). Setelah beberapa lama menjadi tempat hilir mudik perahu dari Minawanua maupun Remboken, pada tahun 1809 dibentuk menjadi sebuah wanua dengan nama Timadeng (yang berarti semenanjung). Nama wanua ini kemudian berubah menjadi Tandengan.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-4">
              Saat ini Desa Tandengan terbagi menjadi lima jaga dan memiliki luas desa kurang lebih 128 Ha (1.280.000 m²) dengan jumlah penduduk 1.267 jiwa. Sampai saat ini penduduk dan Pemerintah Desa mengupayakan supaya Desa menjadi salah satu Desa Wisata di Kabupaten Minahasa dan di Sulawesi Utara. Beberapa &apos;potensi&apos; Objek Wisata bisa kita temui di Desa ini yakni Wisata Teluk Sumalangka, Teluk Sinawu, Air terjun Tuunan, Tanjung Watu dan Pulau likri.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Galeri Desa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="relative h-48">
                <Image
                  src={`/images/desa${item}.jpg`}
                  alt={`Gambar Desa ${item}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Hubungi Kami</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="outline" size="icon">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default InformasiDesaPage

// TODO: Implementasi fitur untuk admin agar dapat mengelola informasi desa, struktur desa, dan tautan media sosial secara dinamis
// Ini dapat dilakukan dengan menambahkan halaman admin dan API endpoints untuk CRUD operasi pada informasi desa