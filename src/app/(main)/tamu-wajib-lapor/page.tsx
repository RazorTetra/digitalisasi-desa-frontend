// src/app/(main)/tamu-wajib-lapor/page.tsx
"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from 'lucide-react'

const formSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama harus diisi minimal 2 karakter.",
  }),
  nik: z.string().length(16, {
    message: "NIK harus terdiri dari 16 digit.",
  }),
  alamatAsal: z.string().min(5, {
    message: "Alamat asal harus diisi minimal 5 karakter.",
  }),
  tujuan: z.string().min(2, {
    message: "Tujuan kunjungan harus diisi.",
  }),
  lamaMenginap: z.string().min(1, {
    message: "Lama menginap harus dipilih.",
  }),
  tempatMenginap: z.string().min(5, {
    message: "Tempat menginap harus diisi minimal 5 karakter.",
  }),
  nomorTelepon: z.string().min(10, {
    message: "Nomor telepon harus diisi minimal 10 digit.",
  }),
})

const TamuWajibLaporPage: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nik: "",
      alamatAsal: "",
      tujuan: "",
      lamaMenginap: "",
      tempatMenginap: "",
      nomorTelepon: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement submission to backend
    console.log(values)
    alert("Formulir berhasil dikirim!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Tamu Wajib Lapor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Penting</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Pelaporan Wajib</AlertTitle>
              <AlertDescription>
                Setiap tamu yang menginap di Desa Tandengan wajib melaporkan diri dalam waktu 1x24 jam.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prosedur Pelaporan</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Isi formulir di samping dengan lengkap dan benar</li>
              <li>Pastikan nomor telepon yang diisi aktif</li>
              <li>Simpan bukti pelaporan yang diterima</li>
              <li>Tunjukkan bukti pelaporan jika diminta oleh petugas</li>
            </ol>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Kontak Darurat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-2">Jika ada pertanyaan atau keadaan darurat, hubungi:</p>
            <p className="font-semibold">Kantor Desa Tandengan</p>
            <p>Telp: (0123) 456-7890</p>
            <p>Email: info@desatandengan.go.id</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Formulir Tamu Wajib Lapor</CardTitle>
          <CardDescription>Isi data diri Anda dengan lengkap dan benar</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="nama"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nama lengkap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIK</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan 16 digit NIK" {...field} />
                    </FormControl>
                    <FormDescription>
                      Nomor Induk Kependudukan (16 digit)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alamatAsal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Asal</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Masukkan alamat asal" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tujuan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tujuan Kunjungan</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan tujuan kunjungan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lamaMenginap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lama Menginap</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih lama menginap" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 hari</SelectItem>
                        <SelectItem value="4-7">4-7 hari</SelectItem>
                        <SelectItem value="8-14">8-14 hari</SelectItem>
                        <SelectItem value="15+">Lebih dari 14 hari</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tempatMenginap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tempat Menginap</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan alamat tempat menginap" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nomorTelepon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan nomor telepon" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Kirim Laporan</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Pertanyaan Umum</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Siapa yang wajib lapor?</AccordionTrigger>
              <AccordionContent>
                Setiap tamu yang menginap di Desa Tandengan, baik di penginapan umum maupun di rumah penduduk, wajib melaporkan diri.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Apa konsekuensi jika tidak melapor?</AccordionTrigger>
              <AccordionContent>
                Tamu yang tidak melapor dapat dikenakan sanksi administratif sesuai dengan peraturan desa yang berlaku.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Bagaimana jika ada perubahan rencana menginap?</AccordionTrigger>
              <AccordionContent>
                Jika ada perubahan rencana, seperti perpanjangan atau pengurangan waktu menginap, harap segera melaporkan perubahan tersebut ke kantor desa.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

export default TamuWajibLaporPage