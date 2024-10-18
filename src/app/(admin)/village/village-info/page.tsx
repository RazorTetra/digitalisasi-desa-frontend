// src/app/(admin)/village/village-info/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { getVillageInfo, updateVillageInfo, VillageInfo } from '@/api/villageApi'
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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

const villageInfoSchema = z.object({
  history: z.string().min(10, "Sejarah desa harus minimal 10 karakter")
})

const AdminVillageInfoPage: React.FC = () => {
  const { user } = useAuth()
  const [, setVillageInfo] = useState<VillageInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof villageInfoSchema>>({
    resolver: zodResolver(villageInfoSchema),
    defaultValues: { history: '' }
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const infoData = await getVillageInfo()
        setVillageInfo(infoData)
        form.reset({ history: infoData.history })
      } catch  {
        setError("Gagal memuat data. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [form])

  const onSubmit = async (data: z.infer<typeof villageInfoSchema>) => {
    try {
      const updatedInfo = await updateVillageInfo(data)
      setVillageInfo(updatedInfo)
      setError(null)
    } catch  {
      setError("Gagal memperbarui informasi desa")
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
      <h1 className="text-3xl font-bold mb-8">Informasi Desa</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Desa</CardTitle>
          <CardDescription>Kelola informasi umum tentang desa</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="history"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sejarah Desa</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Simpan Perubahan</Button>
            </form>
          </Form>
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

export default AdminVillageInfoPage