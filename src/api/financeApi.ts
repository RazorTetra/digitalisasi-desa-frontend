// src/api/financeApi.ts

import { apiClient } from './apiClient';

// Types for common responses
interface Timestamp {
  createdAt: string;
  updatedAt: string;
}

// Banner types
export interface FinanceBanner extends Timestamp {
  id: string;
  imageUrl: string;
}

// Info types
export interface FinanceInfo extends Timestamp {
  id: string;
  content: string;
}

// Income types
export interface IncomeItem extends Timestamp {
  id: string;
  uraian: string;
  anggaran: number;
  realisasi: number;
}

export interface CreateIncomeItemData {
  uraian: string;
  anggaran: number;
  realisasi: number;
}

// Expense types
export interface ExpenseItem extends Timestamp {
  id: string;
  uraian: string;
  anggaran: number;
  realisasi: number;
}

export interface CreateExpenseItemData {
  uraian: string;
  anggaran: number;
  realisasi: number;
}

// Financing types
export interface FinancingItem extends Timestamp {
  id: string;
  uraian: string;
  anggaran: number;
  realisasi: number;
}

export interface CreateFinancingItemData {
  uraian: string;
  anggaran: number;
  realisasi: number;
}

// Summary types
export interface FinanceSummary {
  totalPendapatan: {
    anggaran: number;
    realisasi: number;
    sisa: number;
  };
  totalBelanja: {
    anggaran: number;
    realisasi: number;
    sisa: number;
    jumlahPendapatan: number;
    surplusDefisit: number;
  };
  totalPembiayaan: {
    anggaran: number;
    realisasi: number;
    sisa: number;
    pembiayaanNetto: number;
    sisaLebihPembiayaanAnggaran: number;
  };
}

// Public Endpoints

export const getFinanceBanner = (): Promise<FinanceBanner> =>
  apiClient.get('/finance/banner').then(response => response.data);

export const getFinanceInfo = (): Promise<FinanceInfo> =>
  apiClient.get('/finance/info').then(response => response.data);

export const getIncomeItems = (): Promise<IncomeItem[]> =>
  apiClient.get('/finance/income').then(response => response.data);

export const getExpenseItems = (): Promise<ExpenseItem[]> =>
  apiClient.get('/finance/expense').then(response => response.data);

export const getFinancingItems = (): Promise<FinancingItem[]> =>
  apiClient.get('/finance/financing').then(response => response.data);

export const getFinanceSummary = (): Promise<FinanceSummary> =>
  apiClient.get('/finance/summary').then(response => response.data);

// Admin Endpoints

export const updateFinanceBanner = (formData: FormData): Promise<FinanceBanner> =>
  apiClient.put('/finance/banner', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data);

export const updateFinanceInfo = (content: string): Promise<FinanceInfo> =>
  apiClient.put('/finance/info', { content }).then(response => response.data);

// Income Management
export const createIncomeItem = (data: CreateIncomeItemData): Promise<IncomeItem> =>
  apiClient.post('/finance/income', data).then(response => response.data);

export const updateIncomeItem = (id: string, data: CreateIncomeItemData): Promise<IncomeItem> =>
  apiClient.put(`/finance/income/${id}`, data).then(response => response.data);

export const deleteIncomeItem = (id: string): Promise<void> =>
  apiClient.delete(`/finance/income/${id}`).then(() => undefined);

// Expense Management
export const createExpenseItem = (data: CreateExpenseItemData): Promise<ExpenseItem> =>
  apiClient.post('/finance/expense', data).then(response => response.data);

export const updateExpenseItem = (id: string, data: CreateExpenseItemData): Promise<ExpenseItem> =>
  apiClient.put(`/finance/expense/${id}`, data).then(response => response.data);

export const deleteExpenseItem = (id: string): Promise<void> =>
  apiClient.delete(`/finance/expense/${id}`).then(() => undefined);

// Financing Management
export const createFinancingItem = (data: CreateFinancingItemData): Promise<FinancingItem> =>
  apiClient.post('/finance/financing', data).then(response => response.data);

export const updateFinancingItem = (id: string, data: CreateFinancingItemData): Promise<FinancingItem> =>
  apiClient.put(`/finance/financing/${id}`, data).then(response => response.data);

export const deleteFinancingItem = (id: string): Promise<void> =>
  apiClient.delete(`/finance/financing/${id}`).then(() => undefined);