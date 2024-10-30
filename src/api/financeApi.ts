// src/api/financeApi.ts
import { apiClient } from "./apiClient";

// Banner types
export interface FinanceBanner {
  id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Info types
export interface FinanceInfo {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Period types
export interface Period {
  id: string;
  tahun: number;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  uraian: string;
  dana: number;
  periodId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  uraian: string;
  dana: number;
  periodId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Financing {
  id: string;
  uraian: string;
  dana: number;
  jenis: "PENERIMAAN" | "PENGELUARAN";
  periodId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinanceSummary {
  jumlahPendapatan: number;
  jumlahBelanja: number;
  surplusDefisit: number;
  pembiayaanNeto: number;
}

export interface PeriodDetail extends Period {
  incomes: Income[];
  expenses: Expense[];
  financings: Financing[];
  summary: FinanceSummary;
}

// Request Types
export interface CreatePeriodRequest {
  tahun: number;
}

export interface UpdatePeriodRequest {
  tahun: number;
}

export interface CreateIncomeRequest {
  uraian: string;
  dana: number;
}

export interface CreateExpenseRequest {
  uraian: string;
  dana: number;
}

export interface CreateFinancingRequest {
  uraian: string;
  dana: number;
  jenis: "PENERIMAAN" | "PENGELUARAN";
}

// Banner and Info Public Endpoints
export const getFinanceBanner = (): Promise<FinanceBanner> =>
  apiClient.get("/finance/banner").then((response) => response.data);

export const getFinanceInfo = (): Promise<FinanceInfo> =>
  apiClient.get("/finance/info").then((response) => response.data);

// Banner and Info Admin Endpoints
export const updateFinanceBanner = (formData: FormData): Promise<FinanceBanner> =>
  apiClient
    .put("/finance/banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);

export const updateFinanceInfo = (content: string): Promise<FinanceInfo> =>
  apiClient.put("/finance/info", { content }).then((response) => response.data);

// Period Public Endpoints
export const getAllPeriods = (): Promise<Period[]> =>
  apiClient.get("/finance/periods").then((response) => response.data);

export const getLatestPeriod = (): Promise<PeriodDetail> =>
  apiClient.get("/finance/periods/latest").then((response) => response.data);

export const getPeriodById = (id: string): Promise<PeriodDetail> =>
  apiClient.get(`/finance/periods/${id}`).then((response) => response.data);

// Period Admin Endpoints
export const createPeriod = (data: CreatePeriodRequest): Promise<PeriodDetail> =>
  apiClient.post("/finance/periods", data).then((response) => response.data);

export const updatePeriod = (id: string, data: UpdatePeriodRequest): Promise<Period> =>
  apiClient.put(`/finance/periods/${id}`, data).then((response) => response.data);

export const deletePeriod = (id: string): Promise<void> =>
  apiClient.delete(`/finance/periods/${id}`).then(() => undefined);

// Income Management Endpoints
export const createIncome = (periodId: string, data: CreateIncomeRequest): Promise<Income> =>
  apiClient
    .post(`/finance/periods/${periodId}/income`, data)
    .then((response) => response.data);

export const updateIncome = (id: string, data: CreateIncomeRequest): Promise<Income> =>
  apiClient.put(`/finance/income/${id}`, data).then((response) => response.data);

export const deleteIncome = (id: string): Promise<void> =>
  apiClient.delete(`/finance/income/${id}`).then(() => undefined);

// Expense Management Endpoints
export const createExpense = (periodId: string, data: CreateExpenseRequest): Promise<Expense> =>
  apiClient
    .post(`/finance/periods/${periodId}/expense`, data)
    .then((response) => response.data);

export const updateExpense = (id: string, data: CreateExpenseRequest): Promise<Expense> =>
  apiClient.put(`/finance/expense/${id}`, data).then((response) => response.data);

export const deleteExpense = (id: string): Promise<void> =>
  apiClient.delete(`/finance/expense/${id}`).then(() => undefined);

// Financing Management Endpoints
export const createFinancing = (periodId: string, data: CreateFinancingRequest): Promise<Financing> =>
  apiClient
    .post(`/finance/periods/${periodId}/financing`, data)
    .then((response) => response.data);

export const updateFinancing = (id: string, data: CreateFinancingRequest): Promise<Financing> =>
  apiClient.put(`/finance/financing/${id}`, data).then((response) => response.data);

export const deleteFinancing = (id: string): Promise<void> =>
  apiClient.delete(`/finance/financing/${id}`).then(() => undefined);