// src/api/tamuWajibLaporApi.ts
import { apiClient } from './apiClient';

export type LamaMenginap = '1-3' | '4-7' | '8-14' | '15+';
export type TamuStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface TamuWajibLapor {
  id: string;
  trackingCode: string;
  nama: string;
  nik: string;
  alamatAsal: string;
  tujuan: string;
  lamaMenginap: LamaMenginap;
  tempatMenginap: string;
  nomorTelepon: string;
  status: TamuStatus;
  statusMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTamuWajibLaporData {
  nama: string;
  nik: string;
  alamatAsal: string;
  tujuan: string;
  lamaMenginap: LamaMenginap;
  tempatMenginap: string;
  nomorTelepon: string;
}

export interface UpdateTamuStatusData {
  status: TamuStatus;
  statusMessage: string;
}

// Public Endpoints
export const submitLaporan = async (data: CreateTamuWajibLaporData): Promise<TamuWajibLapor> => {
  const response = await apiClient.post<TamuWajibLapor>('/tamu-wajib-lapor', data);
  return response.data;
};

export const checkStatus = async (trackingCode: string): Promise<TamuWajibLapor> => {
  const response = await apiClient.get<TamuWajibLapor>(`/tamu-wajib-lapor/status/${trackingCode}`);
  return response.data;
};

export const getRecentSubmissions = async (limit: number = 10): Promise<TamuWajibLapor[]> => {
  const response = await apiClient.get<TamuWajibLapor[]>(`/tamu-wajib-lapor/recent?limit=${limit}`);
  return response.data;
};

// Admin Endpoints
export const getAllLaporan = async (): Promise<TamuWajibLapor[]> => {
  const response = await apiClient.get<TamuWajibLapor[]>('/tamu-wajib-lapor');
  return response.data;
};

export const getLaporanById = async (id: string): Promise<TamuWajibLapor> => {
  const response = await apiClient.get<TamuWajibLapor>(`/tamu-wajib-lapor/${id}`);
  return response.data;
};

export const updateStatus = async (id: string, data: UpdateTamuStatusData): Promise<TamuWajibLapor> => {
  const response = await apiClient.put<TamuWajibLapor>(`/tamu-wajib-lapor/${id}/status`, data);
  return response.data;
};

export const deleteLaporan = async (id: string): Promise<void> => {
  await apiClient.delete(`/tamu-wajib-lapor/${id}`);
};

