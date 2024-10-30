// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Mountain,
  UserCheck,
  XCircle,
  Bell,
  Loader2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useDashboard } from './_hooks/useDashboard';

const StatsCard = ({ 
  title, 
  value, 
  description,
  icon: Icon,
  loading,
  colorClass = "text-foreground"
}: { 
  title: string;
  value: number;
  description?: string;
  icon: React.ElementType;
  loading: boolean;
  colorClass?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      {loading ? (
        <Skeleton className="h-7 w-20" />
      ) : (
        <>
          <div className={`text-2xl font-bold ${colorClass}`}>
            {value.toLocaleString()}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

export default function AdminDashboard() {
  const { user } = useAuth(true);
  const { stats, isLoading, fetchStats } = useDashboard();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [user, fetchStats]);

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  const statusColors = {
    PENDING: 'text-yellow-500',
    APPROVED: 'text-green-500',
    REJECTED: 'text-red-500'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang kembali, {user.namaDepan}
            </p>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        {/* Tamu Wajib Lapor Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Status Tamu Wajib Lapor</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Laporan"
              value={stats?.tamuWajibLapor.totalSubmissions ?? 0}
              description="Total laporan masuk"
              icon={Clock}
              loading={isLoading}
            />
            <StatsCard
              title="Menunggu Verifikasi"
              value={stats?.tamuWajibLapor.pending ?? 0}
              description="Perlu diproses"
              icon={Clock}
              loading={isLoading}
              colorClass="text-yellow-500"
            />
            <StatsCard
              title="Disetujui"
              value={stats?.tamuWajibLapor.approved ?? 0}
              description="Laporan disetujui"
              icon={UserCheck}
              loading={isLoading}
              colorClass="text-green-500"
            />
            <StatsCard
              title="Ditolak"
              value={stats?.tamuWajibLapor.rejected ?? 0}
              description="Laporan ditolak"
              icon={XCircle}
              loading={isLoading}
              colorClass="text-red-500"
            />
          </div>

          {/* Recent Submissions */}
          {stats?.tamuWajibLapor.recentSubmissions.length ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Laporan Terbaru</CardTitle>
                <CardDescription>5 laporan tamu terbaru</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Nama</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.tamuWajibLapor.recentSubmissions.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {format(new Date(item.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                        </TableCell>
                        <TableCell>{item.nama}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[item.status]}>
                            {item.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <Link href="/admin/tamu-wajib-lapor">
                    <Button variant="link">
                      Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Destinations */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Destinasi Wisata</CardTitle>
                  <CardDescription>
                    Total: {stats?.tourism.totalDestinations ?? 0} destinasi
                  </CardDescription>
                </div>
                <Mountain className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.tourism.recentDestinations.map((destination) => (
                  <div key={destination.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold">{destination.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {destination.location}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="text-right">
                  <Link href="/admin/pariwisata">
                    <Button variant="link">
                      Kelola Destinasi <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pengumuman</CardTitle>
                  <CardDescription>
                    Jumlah Pengumuman {stats?.pengumuman.total}
                  </CardDescription>
                </div>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.pengumuman.recentAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="space-y-1">
                    <h4 className="font-semibold">{announcement.judul}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(announcement.tanggal), 'dd MMM yyyy', { locale: id })}
                    </p>
                  </div>
                ))}
                <div className="text-right">
                  <Link href="/admin/announcement">
                    <Button variant="link">
                      Kelola Pengumuman <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}