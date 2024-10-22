"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/hooks/useAuth'
import { Loader2, Trash2, Upload, Download } from 'lucide-react'
import { 
  getAllFormatSurat, 
  uploadFormatSurat, 
  deleteFormatSurat,
  FormatSurat 
} from '@/api/suratApi'

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/pdf" // .pdf
];

// Schema yang tidak menggunakan FileList untuk kompatibilitas SSR
const formatSuratSchema = z.object({
  nama: z.string().min(1, "Nama format surat harus diisi"),
  file: z.any()
    .optional()
    .superRefine((file, ctx) => {
      if (!file || !file[0]) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "File harus dipilih",
        });
        return;
      }

      if (file[0].size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ukuran file maksimal 5MB",
        });
        return;
      }

      if (!ACCEPTED_FILE_TYPES.includes(file[0].type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format file harus .doc, .docx, atau .pdf",
        });
        return;
      }
    }),
});

type FormatSuratForm = z.infer<typeof formatSuratSchema>;

const AdminSuratPage: React.FC = () => {
  const { user } = useAuth(true)
  const [formatSurat, setFormatSurat] = useState<FormatSurat[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormatSuratForm>({
    resolver: zodResolver(formatSuratSchema),
    defaultValues: {
      nama: '',
    }
  });

  const fetchFormatSurat = useCallback(async () => {
    try {
      const data = await getAllFormatSurat()
      setFormatSurat(data)
    } catch {
      toast({
        title: "Error",
        description: "Gagal memuat daftar format surat",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    if (!user) return;
    fetchFormatSurat()
  }, [user, fetchFormatSurat])

  const onSubmit = async (data: FormatSuratForm) => {
    if (!data.file?.[0]) return;

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('nama', data.nama)
      formData.append('file', data.file[0])

      await uploadFormatSurat(formData)
      await fetchFormatSurat()
      form.reset()
      toast({
        title: "Sukses",
        description: "Format surat berhasil diunggah",
      })
    } catch {
      toast({
        title: "Error",
        description: "Gagal mengunggah format surat",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setIsAlertOpen(false)
    
    try {
      await deleteFormatSurat(id)
      await fetchFormatSurat()
      toast({
        title: "Sukses",
        description: "Format surat berhasil dihapus",
      })
    } catch {
      toast({
        title: "Error",
        description: "Gagal menghapus format surat",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Format Surat</CardTitle>
            <CardDescription>
              Kelola format surat yang tersedia untuk diunduh oleh warga
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Format Surat</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field: { ref, ...field } }) => (
                    <FormItem>
                      <FormLabel>File Template</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".doc,.docx,.pdf"
                          onChange={(e) => field.onChange(e.target.files)}
                          ref={ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengunggah...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Unggah Format Surat
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Format Surat</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead>Terakhir Diperbarui</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {formatSurat.map((format) => (
                    <TableRow key={format.id}>
                      <TableCell>{format.nama}</TableCell>
                      <TableCell>
                        {new Date(format.createdAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        {new Date(format.updatedAt).toLocaleDateString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a 
                              href={format.downloadUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              download
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={deletingId === format.id}
                              >
                                {deletingId === format.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Hapus Format Surat
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus format surat &quot;{format.nama}&quot;? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(format.id)}
                                >
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminSuratPage