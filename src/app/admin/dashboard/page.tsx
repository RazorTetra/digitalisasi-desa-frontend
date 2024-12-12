// src/app/admin/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { format as formatDate } from "date-fns";
import { id } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "./_hooks/useDashboard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FileText, Download } from "lucide-react";

const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  loading,
  colorClass = "text-foreground",
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
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
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
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

const DestinationImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative aspect-square w-16 h-16">
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 64px, 64px"
      className="object-cover rounded"
      priority={false}
    />
  </div>
);

export default function AdminDashboard() {
  const { user } = useAuth(true);
  const { stats, isLoading, fetchStats } = useDashboard();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchStats();
    }
  }, [user, fetchStats]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const statusColors = {
    PENDING: "text-yellow-500",
    APPROVED: "text-green-500",
    REJECTED: "text-red-500",
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
          <h2 className="text-xl font-semibold mb-4">
            Status Tamu Wajib Lapor
          </h2>
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
                          {formatDate(
                            new Date(item.createdAt),
                            "dd MMM yyyy, HH:mm",
                            { locale: id }
                          )}
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

        {/* Format Surat Stats */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Statistik Format Surat</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Format Surat"
              value={stats?.surat.totalFormats ?? 0}
              description="Format surat tersedia"
              icon={FileText}
              loading={isLoading}
            />
            <StatsCard
              title="Total Unduhan"
              value={stats?.surat.totalDownloads ?? 0}
              description="Total semua unduhan"
              icon={Download}
              loading={isLoading}
              colorClass="text-blue-500"
            />
          </div>

          {/* Download Statistics Chart */}
          {stats?.surat.downloadStats.length ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Format Surat Terpopuler</CardTitle>
                <CardDescription>
                  3 format surat dengan unduhan terbanyak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats?.surat.downloadStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        allowDecimals={false}
                        domain={[0, "auto"]}
                        tickCount={5}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          Math.round(value),
                          "Unduhan",
                        ]}
                      />
                      <Bar
                        dataKey="downloadCount"
                        fill="#3b82f6"
                        name="Jumlah Unduhan"
                        label={{
                          position: "top",
                          formatter: (value: number) => Math.round(value),
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : null}

          {/* Recent Formats */}
          {stats?.surat.recentFormats.length ? (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Format Surat Terbaru</CardTitle>
                <CardDescription>
                  3 format surat terbaru yang ditambahkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama Format</TableHead>
                      <TableHead>Total Unduhan</TableHead>
                      <TableHead>Tanggal Ditambahkan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.surat.recentFormats.map((format) => (
                      <TableRow key={format.id}>
                        <TableCell>{format.nama}</TableCell>
                        <TableCell>{format.totalDownloads}</TableCell>
                        <TableCell>
                          {formatDate(
                            new Date(format.createdAt),
                            "dd MMM yyyy",
                            {
                              locale: id,
                            }
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="mt-4 text-right">
                  <Link href="/admin/surat">
                    <Button variant="link">
                      Kelola Format Surat{" "}
                      <ArrowRight className="ml-2 h-4 w-4" />
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
                  <div
                    key={destination.id}
                    className="flex items-center space-x-4"
                  >
                    <DestinationImage
                      src={destination.image}
                      alt={destination.name}
                    />
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
                      {formatDate(
                        new Date(announcement.tanggal),
                        "dd MMM yyyy",
                        {
                          locale: id,
                        }
                      )}
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
