// src/app/admin/users/page.tsx
"use client"

import { useState, useEffect } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { getUsers, createUser, updateUser, deleteUser } from '@/api/userApi'

// Define the User type based on the backend schema
interface User {
  id: string
  namaDepan: string
  namaBelakang: string
  nomorHp: string
  email: string
  role: 'ADMIN' | 'USER'
}

const userSchema = z.object({
  namaDepan: z.string().min(1, "Nama depan harus diisi"),
  namaBelakang: z.string().min(1, "Nama belakang harus diisi"),
  nomorHp: z.string().min(10, "Nomor HP tidak valid"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(['ADMIN', 'USER']),
})

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      namaDepan: "",
      namaBelakang: "",
      nomorHp: "",
      email: "",
      password: "",
      role: "USER",
    },
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
    } catch (err) {
      setError('Gagal memuat data pengguna')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof userSchema>) => {
    try {
      if (editingUser) {
        await updateUser(editingUser.id, data)
      } else {
        await createUser(data)
      }
      fetchUsers()
      setIsDialogOpen(false)
      form.reset()
      setEditingUser(null)
    } catch (err) {
      setError('Gagal menyimpan data pengguna')
      console.error(err)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    form.reset({
      namaDepan: user.namaDepan,
      namaBelakang: user.namaBelakang,
      nomorHp: user.nomorHp,
      email: user.email,
      password: '', // We don't set the password for editing
      role: user.role,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(id)
        fetchUsers()
      } catch (err) {
        setError('Gagal menghapus pengguna')
        console.error(err)
      }
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manajemen Pengguna</h1>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => { setEditingUser(null); form.reset(); }}>
            Tambah Pengguna
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="namaDepan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Depan</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select {...field} className="w-full p-2 border rounded">
                        <option value="USER">User</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Simpan</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nomor HP</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{`${user.namaDepan} ${user.namaBelakang}`}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.nomorHp}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <Button variant="outline" className="mr-2" onClick={() => handleEdit(user)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(user.id)}>
                  Hapus
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}