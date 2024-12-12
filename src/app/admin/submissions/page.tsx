// src/app/admin/submissions/page.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { SubmissionTable } from "./_components/submission-table";
import {
  Submission,
  SubmissionStats,
  SubmissionStatus,
  getAllSubmissions,
  getSubmissionStats,
} from "@/api/submissionApi";
import { SubmissionStatsCollapsible } from "./_components/submission-stats-collapsible";

export default function SubmissionsPage() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<SubmissionStats[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, loading: authLoading } = useAuth(true);

  const fetchData = useCallback(async () => {
    try {
      const [submissionsData, statsData] = await Promise.all([
        getAllSubmissions(),
        getSubmissionStats(),
      ]);
      setSubmissions(submissionsData);
      setFilteredSubmissions(submissionsData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Gagal memuat data submission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  useEffect(() => {
    const filtered = submissions.filter(
      (submission) =>
        submission.pengirim.toLowerCase().includes(searchQuery.toLowerCase()) ||
        submission.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSubmissions(filtered);
  }, [searchQuery, submissions]);

  const handleDelete = async (deletedId: string) => {
    setSubmissions((prev) =>
      prev.filter((submission) => submission.id !== deletedId)
    );
    try {
      const newStats = await getSubmissionStats();
      setStats(newStats);
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    }
  };

  const handleStatusUpdate = useCallback(
    async (id: string, newStatus: SubmissionStatus) => {
      setSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === id
            ? { ...submission, status: newStatus }
            : submission
        )
      );
      try {
        const newStats = await getSubmissionStats();
        setStats(newStats);
      } catch (error) {
        console.error("Failed to refresh stats:", error);
      }
    },
    []
  );

  if (authLoading || !user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-8"
      >
        {/* Stats Overview */}
        <SubmissionStatsCollapsible stats={stats} />
        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pengajuan Surat</CardTitle>
            <CardDescription>
              Kelola pengajuan surat dari warga desa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari berdasarkan nama pengirim atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">
                  Tidak ada pengajuan surat
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery
                    ? "Tidak ada hasil yang cocok dengan pencarian Anda"
                    : "Belum ada pengajuan surat yang masuk"}
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <SubmissionTable
                  submissions={filteredSubmissions}
                  onDelete={handleDelete}
                  onStatusUpdate={handleStatusUpdate}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
