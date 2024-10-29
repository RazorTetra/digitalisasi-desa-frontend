// src/app/admin/village/village-structure/page.tsx
"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Edit, Trash2, ArrowUpDown, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { StructureFormModal } from './_components/StructureFormModal'
import { useVillageStructure } from './_hooks/useVillageStructure'
import type { VillageStructure } from '@/api/villageApi'

const AdminVillageStructurePage = () => {
  const { user } = useAuth(true)
  const {
    structures,
    isLoading,
    isSubmitting,
    searchQuery,
    setSearchQuery,
    addStructure,
    updateStructure,
    deleteStructure,
    handleSort
  } = useVillageStructure()
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingStructure, setEditingStructure] = useState<VillageStructure | undefined>(undefined)

  const handleEdit = (structure: VillageStructure) => {
    setEditingStructure(structure)
    setIsModalOpen(true)
  }

  if (!user || user.role !== 'ADMIN') {
    return <div>Anda tidak memiliki akses ke halaman ini.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Struktur Desa</h1>
        <Button onClick={() => {
          setEditingStructure(undefined)
          setIsModalOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Struktur
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>Daftar Struktur Organisasi</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Cari jabatan atau nama..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Skeleton key={idx} className="h-12 w-full" />
              ))}
            </div>
          ) : structures.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery ? (
                <p>Tidak ada hasil yang cocok dengan pencarian &quot;{searchQuery}&quot;</p>
              ) : (
                <p>Belum ada data struktur organisasi</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('position')}>
                    Jabatan
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    Nama
                    <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {structures.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell className="font-medium">{structure.position}</TableCell>
                    <TableCell>{structure.name}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(structure)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteId(structure.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <StructureFormModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingStructure(undefined)
        }}
        onSubmit={async (data) => {
          const success = editingStructure
            ? await updateStructure(editingStructure.id, data)
            : await addStructure(data);
          
          if (success) {
            setIsModalOpen(false)
            setEditingStructure(undefined)
          }
        }}
        isSubmitting={isSubmitting}
        editData={editingStructure}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus struktur ini? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                if (deleteId) {
                  const success = await deleteStructure(deleteId)
                  if (success) setDeleteId(null)
                }
              }}
              className="bg-destructive text-destructive-foreground"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminVillageStructurePage