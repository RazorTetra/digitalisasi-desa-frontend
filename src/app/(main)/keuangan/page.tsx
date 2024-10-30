/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/(main)/keuangan/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { InfoIcon, ImageIcon, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import {
  getFinanceBanner,
  getFinanceInfo,
  getAllPeriods,
  getPeriodById,
  type FinanceBanner,
  type FinanceInfo,
  type Period,
  type PeriodDetail,
} from "@/api/financeApi";
import { useToast } from "@/hooks/use-toast";

export default function KeuanganPage() {
  const { toast } = useToast();
  const [banner, setBanner] = useState<FinanceBanner | null>(null);
  const [info, setInfo] = useState<FinanceInfo | null>(null);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [periodData, setPeriodData] = useState<PeriodDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPeriod, setIsLoadingPeriod] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial data (banner, info, periods)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [bannerData, infoData, periodsData] = await Promise.all([
          getFinanceBanner(),
          getFinanceInfo(),
          getAllPeriods(),
        ]);

        setBanner(bannerData);
        setInfo(infoData);
        setPeriods(periodsData);

        // Jika ada periode, set periode terakhir sebagai default
        if (periodsData.length > 0) {
          // Sort descending berdasarkan tahun
          const sortedPeriods = [...periodsData].sort(
            (a, b) => b.tahun - a.tahun
          );
          const latestPeriod = sortedPeriods[0];
          setSelectedPeriod(latestPeriod.id);
          // Load data periode terbaru
          handlePeriodChange(latestPeriod.id);
        }

        setError(null);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Gagal memuat data keuangan";
        setError(errorMessage);
        toast({
          title: "Error",
          description: "Gagal memuat data keuangan. Silakan coba lagi nanti.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toast]);

  const handlePeriodChange = async (value: string) => {
    try {
      setIsLoadingPeriod(true);
      const data = await getPeriodById(value);
      setPeriodData(data);
      setSelectedPeriod(value);
      setError(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal memuat data periode";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingPeriod(false);
    }
  };

  const renderChart = () => {
    if (!periodData?.summary) return null;

    const chartData = [
      {
        name: "Pendapatan",
        amount: periodData.summary.jumlahPendapatan,
      },
      {
        name: "Belanja",
        amount: periodData.summary.jumlahBelanja,
      },
      {
        name: "Surplus/Defisit",
        amount: periodData.summary.surplusDefisit,
      },
      {
        name: "Pembiayaan Neto",
        amount: periodData.summary.pembiayaanNeto,
      },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="rounded-lg border bg-background p-2 shadow-md">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">{label}:</span>
              <span className="font-medium text-right">
                {formatCurrency(payload[0].value)}
              </span>
            </div>
          </div>
        );
      }
      return null;
    };

    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Grafik Ringkasan Keuangan</CardTitle>
          <CardDescription>Periode Tahun {periodData.tahun}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value)}
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
                />
                <Bar
                  dataKey="amount"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };
  const renderBanner = () => {
    if (!banner?.imageUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-[600px] bg-muted rounded-lg">
          <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Tidak dapat memuat banner</p>
        </div>
      );
    }

    return (
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
        <Image
          src={banner.imageUrl}
          alt="Banner Keuangan"
          fill
          className="object-contain rounded-lg"
          priority
        />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          Transparansi Keuangan Desa Tandengan
        </h1>

        <div className="mb-8 flex items-center gap-4">
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Periode</SelectLabel>
                {periods
                  .sort((a, b) => b.tahun - a.tahun) // Sort descending
                  .map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      Tahun {period.tahun}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {isLoadingPeriod && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Baliho Keuangan Desa
            </CardTitle>
          </CardHeader>
          <CardContent>{renderBanner()}</CardContent>
        </Card>

        {info && (
          <Alert className="mb-8">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Informasi Keuangan</AlertTitle>
            <AlertDescription>{info.content}</AlertDescription>
          </Alert>
        )}

        {isLoadingPeriod ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : periodData ? (
          <>
            {renderChart()}

            <Tabs defaultValue="pendapatan" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pendapatan">Pendapatan</TabsTrigger>
                <TabsTrigger value="belanja">Belanja</TabsTrigger>
                <TabsTrigger value="pembiayaan">Pembiayaan</TabsTrigger>
              </TabsList>

              <TabsContent value="pendapatan">
                <Card>
                  <CardHeader>
                    <CardTitle>Pendapatan</CardTitle>
                    <CardDescription>
                      Total:{" "}
                      {formatCurrency(periodData.summary.jumlahPendapatan)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Uraian</th>
                            <th className="text-right p-2">Dana</th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodData.incomes.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.uraian}</td>
                              <td className="text-right p-2">
                                {formatCurrency(item.dana)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="belanja">
                <Card>
                  <CardHeader>
                    <CardTitle>Belanja</CardTitle>
                    <CardDescription>
                      Total: {formatCurrency(periodData.summary.jumlahBelanja)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Uraian</th>
                            <th className="text-right p-2">Dana</th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodData.expenses.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.uraian}</td>
                              <td className="text-right p-2">
                                {formatCurrency(item.dana)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pembiayaan">
                <Card>
                  <CardHeader>
                    <CardTitle>Pembiayaan</CardTitle>
                    <CardDescription>
                      Total Neto:{" "}
                      {formatCurrency(periodData.summary.pembiayaanNeto)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-2">Uraian</th>
                            <th className="text-center p-2">Jenis</th>
                            <th className="text-right p-2">Dana</th>
                          </tr>
                        </thead>
                        <tbody>
                          {periodData.financings.map((item) => (
                            <tr key={item.id} className="border-b">
                              <td className="p-2">{item.uraian}</td>
                              <td className="text-center p-2">{item.jenis}</td>
                              <td className="text-right p-2">
                                {formatCurrency(item.dana)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Pilih Periode</AlertTitle>
            <AlertDescription>
              Silakan pilih periode untuk melihat rincian keuangan
            </AlertDescription>
          </Alert>
        )}
      </motion.div>
    </div>
  );
}
