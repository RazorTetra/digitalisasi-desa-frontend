// src/app/admin/dashboard/page.tsx
"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalUsers: number;
  activeRequests: number;
  completedRequests: number;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeRequests: 0,
    completedRequests: 0,
  });

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      // Fetch dashboard stats here
      // For now, we'll use dummy data
      setStats({
        totalUsers: 1250,
        activeRequests: 45,
        completedRequests: 230,
      });
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return null; // This will be handled by the middleware, but we add this check for extra security
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Pengguna</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Permintaan Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Permintaan Selesai</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.completedRequests}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}