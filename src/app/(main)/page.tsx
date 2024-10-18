// src/app/page.tsx
"use client"

import { Suspense } from 'react'
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"

const HomeContent = () => {
  const services = [
    { title: 'Informasi Desa', desc: 'Sejarah dan struktur perangkat desa', link: '/informasi-desa' },
    { title: 'Tamu Wajib Lapor', desc: 'Lapor dalam 1x24 jam', link: '/tamu-wajib-lapor' },
    { title: 'Surat Menyurat', desc: 'Layanan administrasi surat', link: '/surat-menyurat' },
    { title: 'Transparansi', desc: 'Informasi keuangan desa', link: '/transparansi' },
    { title: 'Pengumuman', desc: 'Informasi dan pengumuman resmi', link: '/pengumuman' },
    { title: 'Pariwisata Desa', desc: 'Potensi wisata Desa Tandengan', link: '/pariwisata' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Selamat Datang di Desa Tandengan Digital</h1>
        <p className="text-xl text-muted-foreground mb-8">Pelayanan digital untuk kemajuan dan transparansi Desa Tandengan</p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        {services.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Konten tambahan bisa ditambahkan di sini */}
              </CardContent>
              <CardFooter>
                <Link href={item.link} className="text-primary hover:underline">
                  Lihat Detail
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </section>

      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Mengapa Desa Tandengan Digital?</h2>
        <p className="text-lg text-muted-foreground mb-8">Kami berkomitmen untuk memberikan pelayanan terbaik dan memudahkan akses informasi bagi seluruh warga Desa Tandengan</p>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { title: 'Efisien', desc: 'Pelayanan cepat dan tepat' },
            { title: 'Transparan', desc: 'Informasi terbuka untuk publik' },
            { title: 'Interaktif', desc: 'Kemudahan komunikasi warga dan perangkat desa' },
            { title: 'Inovatif', desc: 'Pemanfaatan teknologi untuk kemajuan desa' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <section className="text-center mb-16">
      <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
    </section>

    <section className="grid md:grid-cols-3 gap-8 mb-16">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-full">
          <CardHeader>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-4 w-24" />
          </CardFooter>
        </Card>
      ))}
    </section>

    <section className="text-center mb-16">
      <Skeleton className="h-10 w-1/2 mx-auto mb-4" />
      <Skeleton className="h-4 w-3/4 mx-auto mb-8" />
      <div className="grid md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    </section>
  </div>
)

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  )
}