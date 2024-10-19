// src/app/admin/village/village-gallery/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  getGallery,
  addGalleryImage,
  deleteGalleryImage,
  GalleryImage
} from '@/api/villageApi'
import { useAuth } from '@/hooks/useAuth'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, ImageIcon } from 'lucide-react'

const AdminVillageGalleryPage: React.FC = () => {
  const { user } = useAuth()
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const galleryData = await getGallery()
        setGallery(galleryData)
      } catch  {
        setError("Gagal memuat data galeri. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('image', file)

    try {
      const newImage = await addGalleryImage(formData)
      setGallery([...gallery, newImage])
      setError(null)
    } catch  {
      setError("Gagal mengunggah gambar")
    }
  }

  const handleDeleteImage = async (id: string) => {
    try {
      await deleteGalleryImage(id)
      setGallery(gallery.filter(img => img.id !== id))
      setError(null)
    } catch  {
      setError("Gagal menghapus gambar")
    }
  }

  if (!user || user.role !== 'ADMIN') {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Galeri Desa</h1>

      <Card>
        <CardHeader>
          <CardTitle>Galeri Desa</CardTitle>
          <CardDescription>Kelola foto-foto desa</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <Input 
              type="file" 
              onChange={handleImageUpload} 
              accept="image/*"
              className="mb-4"
            />
            <Button>
              <ImageIcon className="mr-2 h-4 w-4" />
              Unggah Gambar Baru
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gallery.map((image) => (
              <Card key={image.id}>
                <CardContent className="p-4">
                  <div className="relative w-full h-48 mb-4">
                    <Image 
                      src={image.imageUrl} 
                      alt={image.description || 'Gambar desa'} 
                      fill
                      style={{objectFit: 'cover'}}
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{image.description || 'Tidak ada deskripsi'}</p>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteImage(image.id)}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hapus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default AdminVillageGalleryPage