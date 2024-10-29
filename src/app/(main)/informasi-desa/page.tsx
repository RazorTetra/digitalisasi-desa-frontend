// src/app/(main)/informasi-desa/page.tsx
"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import { getVillageInfo, getVillageStructure, getGallery, getSocialMedia } from '@/api/villageApi'
import type { VillageInfo, VillageStructure, GalleryImage, SocialMedia } from '@/api/villageApi'
import { OrganizationChart } from './_components/OrganizationChart'

const InformasiDesaPage: React.FC = () => {
  const [villageInfo, setVillageInfo] = useState<VillageInfo | null>(null)
  const [structures, setStructures] = useState<VillageStructure[]>([])
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [, setSelectedImage] = useState<GalleryImage | null>(null)

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
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-3/4 mx-auto mb-12" />
        <div className="space-y-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-[600px]" />
        </div>
      </div>
    )
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

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="structure">Struktur</TabsTrigger>
          <TabsTrigger value="gallery">Galeri</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Sejarah Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {villageInfo?.history || "Belum ada informasi sejarah desa."}
              </p>
            </CardContent>
          </Card>

          <VillageSocialMediaCard socialMedia={socialMedia} />
        </TabsContent>

        <TabsContent value="structure">
          <OrganizationChart structures={structures} />
        </TabsContent>

        <TabsContent value="gallery">
          <Card>
            <CardHeader>
              <CardTitle>Galeri Desa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallery.map((image) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.description || 'Gambar Desa'}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                    />
                    {image.description && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2">
                        <p className="text-white text-sm">{image.description}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

const VillageSocialMediaCard: React.FC<{ socialMedia: SocialMedia[] }> = ({ socialMedia }) => (
  <Card>
    <CardHeader>
      <CardTitle>Media Sosial</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-center space-x-4">
        {socialMedia.map((item) => (
          <Button 
            key={item.id} 
            variant="outline" 
            size="icon" 
            className="rounded-full hover:bg-primary hover:text-primary-foreground"
            asChild
          >
            <a 
              href={item.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label={`Follow us on ${item.platform}`}
            >
              {getSocialMediaIcon(item.platform)}
            </a>
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
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

export default InformasiDesaPage