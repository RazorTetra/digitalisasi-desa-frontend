import { apiClient } from './apiClient';
import { KategoriBerita } from './beritaApi';

// Get all kategori
export const getAllKategori = async (): Promise<KategoriBerita[]> => {
  const response = await apiClient.get<KategoriBerita[]>('/berita-kategori');
  return response.data;
};

// Get kategori by ID
export const getKategoriById = async (id: string): Promise<KategoriBerita> => {
  const response = await apiClient.get<KategoriBerita>(`/berita-kategori/id/${id}`);
  return response.data;
};

// Get kategori by slug
export const getKategoriBySlug = async (slug: string): Promise<KategoriBerita> => {
  const response = await apiClient.get<KategoriBerita>(`/berita-kategori/${slug}`);
  return response.data;
};

// Create new kategori (Admin only)
export interface CreateKategoriData {
  nama: string;
}

export const createKategori = async (data: CreateKategoriData): Promise<KategoriBerita> => {
  const response = await apiClient.post<KategoriBerita>('/berita-kategori', data);
  return response.data;
};

// Update kategori (Admin only)
export const updateKategori = async (id: string, data: CreateKategoriData): Promise<KategoriBerita> => {
  const response = await apiClient.put<KategoriBerita>(`/berita-kategori/${id}`, data);
  return response.data;
};

// Delete kategori (Admin only)
export const deleteKategori = async (id: string): Promise<void> => {
  await apiClient.delete(`/berita-kategori/${id}`);
};