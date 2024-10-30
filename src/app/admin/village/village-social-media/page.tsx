// src/app/admin/village/village-social-media/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  getSocialMedia,
  updateSocialMedia,
  SocialMedia
} from '@/api/villageApi'
import { useAuth } from '@/hooks/useAuth'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FacebookIcon, TwitterIcon, InstagramIcon, Edit2 } from 'lucide-react'

const socialMediaSchema = z.object({
  url: z.string().url("URL tidak valid")
})

type FormValues = {
  url: string;
};

const AdminVillageSocialMediaPage: React.FC = () => {
  const { user } = useAuth()
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingMedia, setEditingMedia] = useState<SocialMedia | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: { url: '' }
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const socialMediaData = await getSocialMedia()
        setSocialMedia(socialMediaData)
      } catch {
        setError("Gagal memuat data media sosial. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: FormValues) => {
    if (!editingMedia) return

    try {
      const updatedSocialMedia = await updateSocialMedia(editingMedia.id, data)
      setSocialMedia(prevMedia => 
        prevMedia.map(sm => sm.id === updatedSocialMedia.id ? updatedSocialMedia : sm)
      )
      setEditingMedia(null)
      setIsDialogOpen(false)
      setError(null)
    } catch {
      setError("Gagal memperbarui media sosial")
    }
  }

  const handleEdit = (media: SocialMedia) => {
    setEditingMedia(media)
    form.reset({ url: media.url })
    setIsDialogOpen(true)
  }

  if (!user || user.role !== 'ADMIN') {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Media Sosial Desa</h1>

      <Card>
        <CardHeader>
          <CardTitle>Media Sosial Desa</CardTitle>
          <CardDescription>Kelola tautan media sosial desa</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {socialMedia.map((sm) => (
              <li key={sm.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  {sm.platform === 'Facebook' && <FacebookIcon className="h-6 w-6 mr-2" />}
                  {sm.platform === 'Twitter' && <TwitterIcon className="h-6 w-6 mr-2" />}
                  {sm.platform === 'Instagram' && <InstagramIcon className="h-6 w-6 mr-2" />}
                  <span>{sm.platform}: {sm.url}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleEdit(sm)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingMedia?.platform} URL</DialogTitle>
            <DialogDescription>
              Masukkan URL baru untuk {editingMedia?.platform}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={`URL ${editingMedia?.platform}`} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Simpan Perubahan</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default AdminVillageSocialMediaPage