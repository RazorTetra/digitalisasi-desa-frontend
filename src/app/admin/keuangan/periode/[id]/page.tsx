// src/app/(admin)/finance/periods/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import {
  getPeriodById,
  type Income,
  type Expense,
  type Financing,
  type PeriodDetail,
  createIncome,
  updateIncome,
  deleteIncome,
  createExpense,
  updateExpense,
  deleteExpense,
  createFinancing,
  updateFinancing,
  deleteFinancing,
} from "@/api/financeApi";

const formSchema = z.object({
  uraian: z.string().min(1, "Uraian harus diisi"),
  dana: z.number(),
  jenis: z.enum(["PENERIMAAN", "PENGELUARAN"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;
type TabValue = "income" | "expense" | "financing";

function isFinancing(item: EditableItem): item is Financing {
  return "jenis" in item;
}

type EditableItem =
  | Income
  | Expense
  | (Financing & { jenis: "PENERIMAAN" | "PENGELUARAN" });

export default function PeriodDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [period, setPeriod] = useState<PeriodDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("income");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<EditableItem | null>(null);

  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uraian: "",
      dana: 0,
      jenis: "PENERIMAAN",
    },
  });

  useEffect(() => {
    const loadPeriod = async () => {
      try {
        const data = await getPeriodById(params.id);
        setPeriod(data);
      } catch {
        notFound();
      } finally {
        setIsLoading(false);
      }
    };
    loadPeriod();
  }, [params.id]);

  useEffect(() => {
    if (selectedItem) {
      form.reset({
        uraian: selectedItem.uraian,
        dana: selectedItem.dana,
        jenis: "jenis" in selectedItem ? selectedItem.jenis : undefined,
      });
    } else {
      form.reset({
        uraian: "",
        dana: 0,
        jenis: "PENERIMAAN",
      });
    }
  }, [selectedItem, form]);

  if (isLoading || !period) {
    return <div>Loading...</div>;
  }

  const handleCreate = async (values: FormValues) => {
    try {
      let updatedPeriod = { ...period };

      switch (activeTab) {
        case "income": {
          const newItem = await createIncome(period.id, values);
          updatedPeriod = {
            ...period,
            incomes: [...period.incomes, newItem],
          };
          break;
        }
        case "expense": {
          const newItem = await createExpense(period.id, values);
          updatedPeriod = {
            ...period,
            expenses: [...period.expenses, newItem],
          };
          break;
        }
        case "financing": {
          if (!values.jenis) return false;
          const newItem = await createFinancing(period.id, {
            ...values,
            jenis: values.jenis,
          });
          updatedPeriod = {
            ...period,
            financings: [...period.financings, newItem],
          };
          break;
        }
      }

      setPeriod(updatedPeriod);
      toast({
        title: "Berhasil menambah data",
        variant: "default",
      });
      setIsFormOpen(false);
      form.reset();
      return true;
    } catch {
      toast({
        title: "Gagal menambah data",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleUpdate = async (values: FormValues) => {
    if (!selectedItem) return false;

    try {
      let updatedPeriod = { ...period };

      switch (activeTab) {
        case "income": {
          const updatedItem = await updateIncome(selectedItem.id, values);
          updatedPeriod = {
            ...period,
            incomes: period.incomes.map((item) =>
              item.id === selectedItem.id ? updatedItem : item
            ),
          };
          break;
        }
        case "expense": {
          const updatedItem = await updateExpense(selectedItem.id, values);
          updatedPeriod = {
            ...period,
            expenses: period.expenses.map((item) =>
              item.id === selectedItem.id ? updatedItem : item
            ),
          };
          break;
        }
        case "financing": {
          if (!values.jenis) return false;
          const updatedItem = await updateFinancing(selectedItem.id, {
            ...values,
            jenis: values.jenis,
          });
          updatedPeriod = {
            ...period,
            financings: period.financings.map((item) =>
              item.id === selectedItem.id ? updatedItem : item
            ),
          };
          break;
        }
      }

      setPeriod(updatedPeriod);
      toast({
        title: "Berhasil mengupdate data",
        variant: "default",
      });
      setIsFormOpen(false);
      setSelectedItem(null);
      form.reset();
      return true;
    } catch {
      toast({
        title: "Gagal mengupdate data",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      let updatedPeriod = { ...period };

      switch (activeTab) {
        case "income":
          await deleteIncome(id);
          updatedPeriod = {
            ...period,
            incomes: period.incomes.filter((item) => item.id !== id),
          };
          break;
        case "expense":
          await deleteExpense(id);
          updatedPeriod = {
            ...period,
            expenses: period.expenses.filter((item) => item.id !== id),
          };
          break;
        case "financing":
          await deleteFinancing(id);
          updatedPeriod = {
            ...period,
            financings: period.financings.filter((item) => item.id !== id),
          };
          break;
      }

      setPeriod(updatedPeriod);
      toast({
        title: "Berhasil menghapus data",
        variant: "default",
      });
    } catch {
      toast({
        title: "Gagal menghapus data",
        description: "Silakan coba lagi nanti",
        variant: "destructive",
      });
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "income":
        return period.incomes;
      case "expense":
        return period.expenses;
      case "financing":
        return period.financings;
      default:
        return [];
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "income":
        return "Pendapatan";
      case "expense":
        return "Belanja";
      case "financing":
        return "Pembiayaan";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Periode Tahun {period.tahun}</h1>
        <p className="text-muted-foreground">
          Kelola pendapatan, belanja, dan pembiayaan
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(period.summary.jumlahPendapatan)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Belanja</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(period.summary.jumlahBelanja)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Surplus/Defisit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(period.summary.surplusDefisit)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pembiayaan Neto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(period.summary.pembiayaanNeto)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex space-x-2">
        {(["income", "expense", "financing"] as TabValue[]).map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "income"
              ? "Pendapatan"
              : tab === "expense"
              ? "Belanja"
              : "Pembiayaan"}
          </Button>
        ))}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Daftar {getTabTitle()}</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setSelectedItem(null);
                }}
              >
                Tambah {getTabTitle()}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>
                {selectedItem
                  ? `Edit ${getTabTitle()}`
                  : `Tambah ${getTabTitle()}`}
              </DialogTitle>
              <form
                onSubmit={form.handleSubmit(
                  selectedItem ? handleUpdate : handleCreate
                )}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="uraian">Uraian</Label>
                  <Input
                    id="uraian"
                    {...form.register("uraian")}
                    className={
                      form.formState.errors.uraian ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.uraian && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.uraian.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dana">Dana</Label>
                  <Input
                    id="dana"
                    type="number"
                    {...form.register("dana", { valueAsNumber: true })}
                    className={
                      form.formState.errors.dana ? "border-red-500" : ""
                    }
                  />
                  {form.formState.errors.dana && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.dana.message}
                    </p>
                  )}
                </div>

                {activeTab === "financing" && (
                  <div className="space-y-2">
                    <Label htmlFor="jenis">Jenis</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(
                          "jenis",
                          value as "PENERIMAAN" | "PENGELUARAN"
                        )
                      }
                      defaultValue={form.getValues("jenis")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENERIMAAN">Penerimaan</SelectItem>
                        <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setSelectedItem(null);
                      form.reset();
                    }}
                  >
                    Batal
                  </Button>
                  <Button type="submit">Simpan</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Uraian</TableHead>
                <TableHead>Dana</TableHead>
                {activeTab === "financing" && <TableHead>Jenis</TableHead>}
                <TableHead>Tanggal Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentData().map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.uraian}</TableCell>
                  <TableCell>{formatCurrency(item.dana)}</TableCell>
                  {activeTab === "financing" && (
                    <TableCell>
                      {isFinancing(item) && (
                        <Badge
                          variant={
                            item.jenis === "PENERIMAAN"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.jenis === "PENERIMAAN"
                            ? "Penerimaan"
                            : "Pengeluaran"}
                        </Badge>
                      )}
                    </TableCell>
                  )}
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedItem(item);
                            setIsFormOpen(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600"
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
