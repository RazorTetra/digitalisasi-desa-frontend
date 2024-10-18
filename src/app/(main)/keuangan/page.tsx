// src/app/(main)/keuangan/page.tsx
"use client"

import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

// TODO: Ganti dengan data aktual dari backend
const pendapatanData = [
  { bulan: 'Jan', jumlah: 50000000 },
  { bulan: 'Feb', jumlah: 55000000 },
  { bulan: 'Mar', jumlah: 48000000 },
  { bulan: 'Apr', jumlah: 52000000 },
  { bulan: 'Mei', jumlah: 58000000 },
  { bulan: 'Jun', jumlah: 60000000 },
]

// TODO: Ganti dengan data aktual dari backend
const pengeluaranData = [
  { kategori: 'Infrastruktur', nilai: 150000000 },
  { kategori: 'Pendidikan', nilai: 100000000 },
  { kategori: 'Kesehatan', nilai: 80000000 },
  { kategori: 'Administrasi', nilai: 50000000 },
  { kategori: 'Lain-lain', nilai: 30000000 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const KeuanganPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Transparansi Keuangan Desa</h1>

      {/* TODO: Ganti dengan komponen dinamis untuk mengelola banner */}
      <div className="mb-8 relative h-64 rounded-lg overflow-hidden">
        <Image
          src="/images/transparansi-banner.jpg"
          alt="Banner Transparansi Keuangan"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h2 className="text-white text-4xl font-bold text-center">Komitmen Kami untuk Transparansi</h2>
        </div>
      </div>

      <Alert className="mb-8">
        <AlertTitle>Informasi Keuangan Terkini</AlertTitle>
        <AlertDescription>
          Data yang ditampilkan di bawah ini merupakan ringkasan keuangan Desa Tandengan untuk tahun anggaran berjalan.
          Untuk informasi lebih lanjut, silakan kunjungi kantor desa atau hubungi kami.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={pendapatanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))} />
                <Legend />
                <Bar dataKey="jumlah" fill="#8884d8" name="Pendapatan" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pengeluaran Desa</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pengeluaranData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="nilai"
                >
                  {pengeluaranData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rincian Anggaran</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Kategori</th>
                <th className="text-right">Anggaran</th>
                <th className="text-right">Realisasi</th>
                <th className="text-right">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {/* TODO: Ganti dengan data aktual dari backend */}
              <tr>
                <td>Pendapatan</td>
                <td className="text-right">Rp 500.000.000</td>
                <td className="text-right">Rp 323.000.000</td>
                <td className="text-right">64.6%</td>
              </tr>
              <tr>
                <td>Belanja</td>
                <td className="text-right">Rp 450.000.000</td>
                <td className="text-right">Rp 280.000.000</td>
                <td className="text-right">62.2%</td>
              </tr>
              <tr>
                <td>Pembiayaan</td>
                <td className="text-right">Rp 50.000.000</td>
                <td className="text-right">Rp 30.000.000</td>
                <td className="text-right">60%</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export default KeuanganPage