// src/app/(main)/keuangan/page.tsx

"use client"

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { InfoIcon, ImageIcon, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/currency'
import { 
  getFinanceBanner, 
  getFinanceSummary,
  getIncomeItems,
  getExpenseItems,
  getFinancingItems,
  type FinanceBanner,
  type FinanceSummary,
  type IncomeItem,
  type ExpenseItem,
  type FinancingItem 
} from '@/api/financeApi'
import { useToast } from '@/hooks/use-toast'

interface FinanceTableProps {
  headers: string[];
  data: Array<{
    label: string;
    values: (number | string)[];
    isTotal?: boolean;
  }>;
}

const FinanceTable: React.FC<FinanceTableProps> = ({ headers, data }) => (
  <table className="w-full">
    <thead className="bg-muted">
      <tr>
        {headers.map((header, index) => (
          <th 
            key={index} 
            className={`p-2 font-medium ${index === 0 ? 'text-left' : 'text-right'}`}
          >
            {header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr 
          key={index} 
          className={`border-b ${row.isTotal ? 'font-bold bg-muted/50' : ''}`}
        >
          <td className="p-2">{row.label}</td>
          {row.values.map((value, idx) => (
            <td key={idx} className="text-right p-2">
              {typeof value === 'number' ? formatCurrency(value) : value}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

export default function KeuanganPage() {
  const { toast } = useToast();
  const [banner, setBanner] = useState<FinanceBanner | null>(null);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [income, setIncome] = useState<IncomeItem[]>([]);
  const [expense, setExpense] = useState<ExpenseItem[]>([]);
  const [financing, setFinancing] = useState<FinancingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerData, summaryData, incomeData, expenseData, financingData] = await Promise.all([
          getFinanceBanner(),
          getFinanceSummary(),
          getIncomeItems(),
          getExpenseItems(),
          getFinancingItems()
        ]);

        setBanner(bannerData);
        setSummary(summaryData);
        setIncome(incomeData);
        setExpense(expenseData);
        setFinancing(financingData);
        setError(null);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Gagal memuat data keuangan';
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

    fetchData();
  }, [toast]);

  const renderBanner = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-[600px] bg-muted rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }

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

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Baliho Keuangan Desa
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderBanner()}
          </CardContent>
        </Card>

        <Alert className="mb-8">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>Informasi Keuangan Terkini</AlertTitle>
          <AlertDescription>
            {summary && (
              <>
                Surplus/Defisit: {formatCurrency(summary.totalBelanja.surplusDefisit)}
              </>
            )}
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="details" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detail Keuangan</TabsTrigger>
            <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Pendapatan</CardTitle>
                <CardDescription>
                  Total Anggaran: {summary && formatCurrency(summary.totalPendapatan.anggaran)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  <FinanceTable 
                    headers={['Uraian', 'Anggaran', 'Realisasi', 'Sisa']}
                    data={[
                      ...income.map(item => ({
                        label: item.uraian,
                        values: [item.anggaran, item.realisasi, item.anggaran - item.realisasi]
                      })),
                      {
                        label: 'JUMLAH PENDAPATAN',
                        values: [
                          summary?.totalPendapatan.anggaran || 0,
                          summary?.totalPendapatan.realisasi || 0,
                          summary?.totalPendapatan.sisa || 0
                        ],
                        isTotal: true
                      }
                    ]}
                  />
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Belanja</CardTitle>
                <CardDescription>
                  Total Realisasi: {summary && formatCurrency(summary.totalBelanja.realisasi)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  <FinanceTable 
                    headers={['Uraian', 'Anggaran', 'Realisasi', 'Sisa']}
                    data={[
                      ...expense.map(item => ({
                        label: item.uraian,
                        values: [item.anggaran, item.realisasi, item.anggaran - item.realisasi]
                      })),
                      {
                        label: 'JUMLAH BELANJA',
                        values: [
                          summary?.totalBelanja.anggaran || 0,
                          summary?.totalBelanja.realisasi || 0,
                          summary?.totalBelanja.sisa || 0
                        ],
                        isTotal: true
                      }
                    ]}
                  />
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pembiayaan</CardTitle>
                <CardDescription>
                  Pembiayaan Netto: {summary && formatCurrency(summary.totalPembiayaan.pembiayaanNetto)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full">
                  <FinanceTable 
                    headers={['Uraian', 'Jumlah']}
                    data={[
                      ...financing.map(item => ({
                        label: item.uraian,
                        values: [item.anggaran]
                      })),
                      {
                        label: 'PEMBIAYAAN NETTO',
                        values: [summary?.totalPembiayaan.pembiayaanNetto || 0],
                        isTotal: true
                      }
                    ]}
                  />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Keuangan</CardTitle>
              </CardHeader>
              <CardContent>
                <FinanceTable 
                  headers={['Uraian', 'Jumlah']}
                  data={[
                    {
                      label: 'Total Pendapatan',
                      values: [summary?.totalPendapatan.realisasi || 0]
                    },
                    {
                      label: 'Total Belanja',
                      values: [summary?.totalBelanja.realisasi || 0]
                    },
                    {
                      label: 'Surplus/Defisit',
                      values: [summary?.totalBelanja.surplusDefisit || 0]
                    },
                    {
                      label: 'Pembiayaan Netto',
                      values: [summary?.totalPembiayaan.pembiayaanNetto || 0]
                    },
                    {
                      label: 'Sisa Lebih Pembiayaan Anggaran',
                      values: [summary?.totalPembiayaan.sisaLebihPembiayaanAnggaran || 0],
                      isTotal: true
                    }
                  ]}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}