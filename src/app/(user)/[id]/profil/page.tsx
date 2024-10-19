"use client"

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { getUserById, updateUser, UserData } from '@/api/userApi'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserCircle } from 'lucide-react'

const profileSchema = z.object({
  namaDepan: z.string().min(2, "Nama depan minimal 2 karakter"),
  namaBelakang: z.string().min(2, "Nama belakang minimal 2 karakter"),
  nomorHp: z.string().min(10, "Nomor HP tidak valid"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const ProfilePage: React.FC = () => {
  const { id } = useParams()
  const { user: currentUser, loading: authLoading } = useAuth()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      namaDepan: "",
      namaBelakang: "",
      nomorHp: "",
      email: "",
      password: "",
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof id !== 'string') return
      try {
        const userData = await getUserById(id)
        setUser(userData)
        form.reset({
          namaDepan: userData.namaDepan,
          namaBelakang: userData.namaBelakang,
          nomorHp: userData.nomorHp,
          email: userData.email,
        })
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        setUpdateError('Gagal memuat data pengguna')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [id, form])

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return

    try {
      const updatedData: Partial<UserData> = {
        namaDepan: data.namaDepan,
        namaBelakang: data.namaBelakang,
        nomorHp: data.nomorHp,
        email: data.email,
      }

      // Only include password if it's provided and we're updating the current user's profile
      if (data.password && currentUser?.id === user.id) {
        await updateUser(user.id, { ...updatedData, password: data.password })
      } else {
        await updateUser(user.id, updatedData)
      }

      setUpdateSuccess(true)
      setUpdateError(null)
      setIsEditing(false)
    } catch {
      setUpdateError("Gagal memperbarui profil. Silakan coba lagi.")
      setUpdateSuccess(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>Pengguna tidak ditemukan atau Anda tidak memiliki akses.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const isOwnProfile = currentUser.id === user.id
  const canEdit = isOwnProfile || currentUser.role === 'ADMIN'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback><UserCircle className="h-20 w-20" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{`${user.namaDepan} ${user.namaBelakang}`}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="namaDepan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Depan</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="namaBelakang"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Belakang</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomorHp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor HP</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing && isOwnProfile && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru (opsional)</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {updateSuccess && (
                <Alert>
                  <AlertDescription>Profil berhasil diperbarui.</AlertDescription>
                </Alert>
              )}
              {updateError && (
                <Alert variant="destructive">
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          {canEdit && (
            isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Batal</Button>
                <Button onClick={form.handleSubmit(onSubmit)}>Simpan Perubahan</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profil</Button>
            )
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default ProfilePage