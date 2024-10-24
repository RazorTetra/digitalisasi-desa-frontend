// src/app/admin/keuangan/page.tsx

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { FinanceItemForm } from "./_components/FinanceItemForm";
import { FinanceTable } from "./_components/FinanceTable";
import { useFinanceItems } from "./_hooks/useFinanceItems";

type ItemType = "income" | "expense" | "financing";

export default function AdminKeuanganPage() {
  const { user } = useAuth(true);
  const [activeTab, setActiveTab] = useState<ItemType>("income");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    items: incomeItems,
    isLoading: isLoadingIncome,
    createItem: createIncomeItem,
    updateItem: updateIncomeItem,
    deleteItem: deleteIncomeItem,
  } = useFinanceItems("income");

  const {
    items: expenseItems,
    isLoading: isLoadingExpense,
    createItem: createExpenseItem,
    updateItem: updateExpenseItem,
    deleteItem: deleteExpenseItem,
  } = useFinanceItems("expense");

  const {
    items: financingItems,
    isLoading: isLoadingFinancing,
    createItem: createFinancingItem,
    updateItem: updateFinancingItem,
    deleteItem: deleteFinancingItem,
  } = useFinanceItems("financing");

  const handleSubmit = async (data: {
    uraian: string;
    anggaran: number;
    realisasi: number;
  }) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        switch (activeTab) {
          case "income":
            await updateIncomeItem(editingItem.id, data);
            break;
          case "expense":
            await updateExpenseItem(editingItem.id, data);
            // src/app/admin/keuangan/page.tsx (continued...)

            break;
          case "financing":
            await updateFinancingItem(editingItem.id, data);
            break;
        }
      } else {
        switch (activeTab) {
          case "income":
            await createIncomeItem(data);
            break;
          case "expense":
            await createExpenseItem(data);
            break;
          case "financing":
            await createFinancingItem(data);
            break;
        }
      }
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      switch (activeTab) {
        case "income":
          await deleteIncomeItem(id);
          break;
        case "expense":
          await deleteExpenseItem(id);
          break;
        case "financing":
          await deleteFinancingItem(id);
          break;
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const getActiveItems = () => {
    switch (activeTab) {
      case "income":
        return { items: incomeItems, isLoading: isLoadingIncome };
      case "expense":
        return { items: expenseItems, isLoading: isLoadingExpense };
      case "financing":
        return { items: financingItems, isLoading: isLoadingFinancing };
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
    }
  };

  if (!user) {
    return null;
  }

  const { items, isLoading } = getActiveItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Manajemen Keuangan</h1>

        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as ItemType)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="income">Pendapatan</TabsTrigger>
            <TabsTrigger value="expense">Belanja</TabsTrigger>
            <TabsTrigger value="financing">Pembiayaan</TabsTrigger>
          </TabsList>

          {["income", "expense", "financing"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Data {getTabTitle()}</CardTitle>
                      <CardDescription>
                        Kelola data {getTabTitle().toLowerCase()} desa
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => {
                        setEditingItem(null);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah {getTabTitle()}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <FinanceTable
                      items={items}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isLoading={isLoading}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingItem
                  ? `Edit ${getTabTitle()}`
                  : `Tambah ${getTabTitle()}`}
              </DialogTitle>
            </DialogHeader>
            <FinanceItemForm
              defaultValues={
                editingItem
                  ? {
                      uraian: editingItem.uraian,
                      anggaran: editingItem.anggaran,
                      realisasi: editingItem.realisasi,
                    }
                  : undefined
              }
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
