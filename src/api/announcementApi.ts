// src/api/announcementApi.ts
import { apiClient } from './apiClient';

export interface Kategori {
  id: string;
  nama: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  tanggal: string;
  kategoriId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePengumumanData {
  judul: string;
  isi: string;
  tanggal: string;
  kategoriId: string;
}

export interface UpdatePengumumanData {
  judul?: string;
  isi?: string;
  tanggal?: string;
  kategoriId?: string;
}

// Kategori API

export const getAllKategori = async (): Promise<Kategori[]> => {
  const response = await apiClient.get<Kategori[]>('/kategori');
  return response.data;
};

export const createKategori = async (nama: string): Promise<Kategori> => {
  const response = await apiClient.post<Kategori>('/kategori', { nama });
  return response.data;
};

export const updateKategori = async (id: string, nama: string): Promise<Kategori> => {
  const response = await apiClient.put<Kategori>(`/kategori/${id}`, { nama });
  return response.data;
};

export const deleteKategori = async (id: string): Promise<void> => {
  await apiClient.delete(`/kategori/${id}`);
};

// Pengumuman API

export const getAllPengumuman = async (): Promise<Pengumuman[]> => {
  const response = await apiClient.get<Pengumuman[]>('/pengumuman');
  return response.data;
};

export const getPengumumanById = async (id: string): Promise<Pengumuman> => {
  const response = await apiClient.get<Pengumuman>(`/pengumuman/${id}`);
  return response.data;
};

export const createPengumuman = async (data: CreatePengumumanData): Promise<Pengumuman> => {
  const response = await apiClient.post<Pengumuman>('/pengumuman', data);
  return response.data;
};

export const updatePengumuman = async (id: string, data: UpdatePengumumanData): Promise<Pengumuman> => {
  const response = await apiClient.put<Pengumuman>(`/pengumuman/${id}`, data);
  return response.data;
};

export const deletePengumuman = async (id: string): Promise<void> => {
  await apiClient.delete(`/pengumuman/${id}`);
};