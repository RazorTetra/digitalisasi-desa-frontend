"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import { getVillageInfo, getVillageStructure, getGallery, getSocialMedia } from '@/api/villageApi'
import { VillageInfo, VillageStructure, GalleryImage, SocialMedia } from '@/api/villageApi'
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog'

const InformasiDesaPage: React.FC = () => {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null)
  const [structures, setStructures] = useState<VillageStructure[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [infoData, structureData, galleryData, socialMediaData] = await Promise.all([
          getVillageInfo(),
          getVillageStructure(),
          getGallery(),
          getSocialMedia()
        ])
        setVillageInfo(infoData)
        setStructures(structureData)
        setGallery(galleryData)
        setSocialMedia(socialMediaData)
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-12 text-center text-primary"
      >
        Informasi Desa Tandengan
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <VillageHistoryCard history={villageInfo?.history} />
        <VillageStructureCard structures={structures} />
      </div>
      
      <VillageGalleryCard gallery={gallery} />
      <VillageSocialMediaCard socialMedia={socialMedia} />
    </div>
  )
}

const VillageStructureCard: React.FC<{ structures: VillageStructure[] }> = ({ structures }) => (
  <Card className="bg-card">
    <CardHeader>
      <CardTitle className="text-2xl text-primary">Struktur Desa</CardTitle>
    </CardHeader>
    <CardContent>
      <Accordion type="single" collapsible className="w-full">
        {structures.map((item, index) => (
          <AccordionItem key={item.id} value={`item-${index}`}>
            <AccordionTrigger className="text-primary hover:text-primary/80">{item.position}</AccordionTrigger>
            <AccordionContent className="text-foreground/80">{item.name}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </CardContent>
  </Card>
)

const VillageHistoryCard: React.FC<{ history: string | undefined }> = ({ history }) => (
  <Card className="bg-card">
    <CardHeader>
      <CardTitle className="text-2xl text-primary">Sejarah Desa</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-foreground leading-relaxed">
        {history || "Belum ada informasi sejarah desa."}
      </p>
    </CardContent>
  </Card>
)

const VillageGalleryCard: React.FC<{ gallery: GalleryImage[] }> = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-primary">Galeri Desa</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={() => setSelectedImage(image)} // Set image for modal view
          >
            <Image
              src={image.imageUrl}
              alt={image.description || 'Gambar Desa'}
              layout="fill"
              objectFit="cover"
              className="rounded-lg transition-transform duration-300 hover:scale-110"
            />
            {image.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-sm">
                {image.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for Fullscreen Image */}
      {selectedImage && (
        <Dialog open={Boolean(selectedImage)} onOpenChange={() => setSelectedImage(null)}>
          <DialogOverlay />
          <DialogContent className="w-full max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-96"
            >
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.description || 'Gambar Desa'}
                layout="fill"
                objectFit="contain"
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const VillageSocialMediaCard: React.FC<{ socialMedia: SocialMedia[] }> = ({ socialMedia }) => (
  <div className="bg-card rounded-lg p-8 text-center">
    <h2 className="text-2xl font-semibold mb-6 text-primary">Ikuti Kami</h2>
    <div className="flex justify-center space-x-4">
      {socialMedia.map((item) => (
        <Button key={item.id} variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-primary-foreground" asChild>
          <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${item.platform}`}>
            {getSocialMediaIcon(item.platform)}
          </a>
        </Button>
      ))}
    </div>
  </div>
)

const getSocialMediaIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'facebook':
      return <Facebook className="h-5 w-5" />
    case 'instagram':
      return <Instagram className="h-5 w-5" />
    case 'twitter':
      return <Twitter className="h-5 w-5" />
    default:
      return <Mail className="h-5 w-5" />
  }
}

const LoadingSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8">
    <Skeleton className="h-12 w-3/4 mx-auto mb-12" />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <Skeleton className="h-64" />
      <Skeleton className="h-64" />
    </div>
    <Skeleton className="h-96 mb-12" />
    <Skeleton className="h-24" />
  </div>
)

export default InformasiDesaPage