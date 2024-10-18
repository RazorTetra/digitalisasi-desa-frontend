// src/app/(admin)/village/village-structure/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { 
  getVillageStructure, 
  createVillageStructure, 
  updateVillageStructure, 
  deleteVillageStructure,
  VillageStructure
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit } from 'lucide-react'

const villageStructureSchema = z.object({
  position: z.string().min(2, "Jabatan harus diisi"),
  name: z.string().min(2, "Nama harus diisi")
})

const AdminVillageStructurePage: React.FC = () => {
  const { user } = useAuth()
  const [structures, setStructures] = useState<VillageStructure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const form = useForm<z.infer<typeof villageStructureSchema>>({
    resolver: zodResolver(villageStructureSchema),
    defaultValues: { position: '', name: '' }
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const structureData = await getVillageStructure()
        setStructures(structureData)
      } catch  {
        setError("Gagal memuat data. Silakan coba lagi.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const onSubmit = async (data: z.infer<typeof villageStructureSchema>) => {
    try {
      if (editingId) {
        const updatedStructure = await updateVillageStructure(editingId, data)
        setStructures(structures.map(s => s.id === editingId ? updatedStructure : s))
        setEditingId(null)
      } else {
        const newStructure = await createVillageStructure(data)
        setStructures([...structures, newStructure])
      }
      form.reset()
      setError(null)
    } catch  {
      setError(editingId ? "Gagal memperbarui struktur desa" : "Gagal menambahkan struktur desa")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteVillageStructure(id)
      setStructures(structures.filter(s => s.id !== id))
      setError(null)
    } catch  {
      setError("Gagal menghapus struktur desa")
    }
  }

  const handleEdit = (structure: VillageStructure) => {
    setEditingId(structure.id)
    form.reset(structure)
  }

  if (!user || user.role !== 'ADMIN') {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Struktur Desa</h1>

      <Card>
        <CardHeader>
          <CardTitle>Struktur Desa</CardTitle>
          <CardDescription>Kelola struktur organisasi desa</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-8">
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jabatan</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">{editingId ? 'Perbarui' : 'Tambah'} Struktur</Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={() => {
                  setEditingId(null)
                  form.reset({ position: '', name: '' })
                }}>
                  Batal
                </Button>
              )}
            </form>
          </Form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jabatan</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {structures.map((structure) => (
                <TableRow key={structure.id}>
                  <TableCell>{structure.position}</TableCell>
                  <TableCell>{structure.name}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(structure)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(structure.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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

export default AdminVillageStructurePage