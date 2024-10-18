// src/app/(main)/pariwisata/page.tsx
"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Tipe data untuk destinasi wisata
interface Destination {
  id: number
  name: string
  description: string
  image: string
}

// Data dummy untuk destinasi wisata
const destinations: Destination[] = [
  { id: 1, name: "Pantai Indah", description: "Pantai berpasir putih dengan air jernih", image: "/images/desa1.jpg" },
  { id: 2, name: "Gunung Hijau", description: "Pemandangan alam yang menakjubkan", image: "/images/desa2.jpg" },
  { id: 3, name: "Air Terjun Pelangi", description: "Air terjun dengan 7 tingkatan warna", image: "/images/desa3.jpg" },
  { id: 4, name: "Danau Biru", description: "Danau jernih dengan pemandangan gunung", image: "/images/desa4.jpg" },
  { id: 5, name: "Hutan Pinus", description: "Hutan pinus yang sejuk dan asri", image: "/images/desa5.jpg" },
]

const PariwisataPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % destinations.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length)
  }

  const openImage = (image: string) => {
    setSelectedImage(image)
  }

  const closeImage = () => {
    setSelectedImage(null)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pariwisata Desa Tandengan</h1>
      
      <div className="relative">
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${currentIndex * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {destinations.map((destination) => (
              <Card key={destination.id} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-2">
                <CardContent className="p-0">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    width={400}
                    height={300}
                    layout="responsive"
                    objectFit="cover"
                    className="rounded-lg cursor-pointer"
                    onClick={() => openImage(destination.image)}
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{destination.name}</h2>
                    <p className="text-gray-600">{destination.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-2 transform -translate-y-1/2"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-2 transform -translate-y-1/2"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={closeImage}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative"
            >
              <Image
                src={selectedImage}
                alt="Selected destination"
                width={800}
                height={600}
                objectFit="contain"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4"
                onClick={closeImage}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PariwisataPage

// TODO: Implementasi fitur untuk admin agar dapat mengelola gambar dan informasi destinasi wisata secara dinamis
// Ini dapat dilakukan dengan menambahkan halaman admin dan API endpoints untuk CRUD operasi pada destinasi wisata