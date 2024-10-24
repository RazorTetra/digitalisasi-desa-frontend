// src/app/admin/keuangan/_hooks/useFinanceItems.ts

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  IncomeItem,
  ExpenseItem,
  FinancingItem,
  getIncomeItems,
  getExpenseItems,
  getFinancingItems,
  createIncomeItem,
  createExpenseItem,
  createFinancingItem,
  updateIncomeItem,
  updateExpenseItem,
  updateFinancingItem,
  deleteIncomeItem,
  deleteExpenseItem,
  deleteFinancingItem
} from '@/api/financeApi';

type ItemType = 'income' | 'expense' | 'financing';
type FinanceItem = IncomeItem | ExpenseItem | FinancingItem;

export function useFinanceItems(type: ItemType) {
  const [items, setItems] = useState<FinanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    try {
      let fetchedItems;
      switch (type) {
        case 'income':
          fetchedItems = await getIncomeItems();
          break;
        case 'expense':
          fetchedItems = await getExpenseItems();
          break;
        case 'financing':
          fetchedItems = await getFinancingItems();
          break;
      }
      setItems(fetchedItems);
      setError(null);
    } catch {
      setError('Gagal memuat data');
      toast({
        title: 'Error',
        description: 'Gagal memuat data. Silakan coba lagi nanti.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [type, toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const createItem = async (data: { uraian: string; anggaran: number; realisasi: number }) => {
    try {
      let newItem;
      switch (type) {
        case 'income':
          newItem = await createIncomeItem(data);
          break;
        case 'expense':
          newItem = await createExpenseItem(data);
          break;
        case 'financing':
          newItem = await createFinancingItem(data);
          break;
      }
      setItems([...items, newItem]);
      toast({
        title: 'Sukses',
        description: 'Data berhasil ditambahkan',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan data',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateItem = async (id: string, data: { uraian: string; anggaran: number; realisasi: number }) => {
    try {
      let updatedItem;
      switch (type) {
        case 'income':
          updatedItem = await updateIncomeItem(id, data);
          break;
        case 'expense':
          updatedItem = await updateExpenseItem(id, data);
          break;
        case 'financing':
          updatedItem = await updateFinancingItem(id, data);
          break;
      }
      setItems(items.map(item => item.id === id ? updatedItem : item));
      toast({
        title: 'Sukses',
        description: 'Data berhasil diperbarui',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Gagal memperbarui data',
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      switch (type) {
        case 'income':
          await deleteIncomeItem(id);
          break;
        case 'expense':
          await deleteExpenseItem(id);
          break;
        case 'financing':
          await deleteFinancingItem(id);
          break;
      }
      setItems(items.filter(item => item.id !== id));
      toast({
        title: 'Sukses',
        description: 'Data berhasil dihapus',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Gagal menghapus data',
        variant: 'destructive',
      });
      throw err;
    }
  };

  return {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    refreshItems: fetchItems,
  };
}