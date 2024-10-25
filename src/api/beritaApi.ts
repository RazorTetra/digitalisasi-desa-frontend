import { apiClient } from './apiClient';

// Interfaces
export interface KategoriBerita {
  id: string;
  nama: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface Berita {
  id: string;
  judul: string;
  slug: string;
  ringkasan: string;
  isi: string;
  gambarUrl: string;
  isHighlight: boolean;
  penulis: string;
  tanggal: string;
  createdAt: string;
  updatedAt: string;
  kategori: KategoriBerita[];
}

export interface CreateBeritaData {
  judul: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  tanggal: string;
  isHighlight?: boolean;
  kategoriIds: string[];
  gambar: File;
}

export interface UpdateBeritaData {
  judul?: string;
  ringkasan?: string;
  isi?: string;
  penulis?: string;
  tanggal?: string;
  isHighlight?: boolean;
  kategoriIds?: string[];
  gambar?: File;
}

// API Functions
/**
 * Mendapatkan semua berita
 */
export const getAllBerita = async (): Promise<Berita[]> => {
  const response = await apiClient.get<Berita[]>('/berita');
  return response.data;
};

/**
 * Mendapatkan berita yang di-highlight
 */
export const getHighlightedBerita = async (): Promise<Berita[]> => {
  const response = await apiClient.get<Berita[]>('/berita/highlighted');
  return response.data;
};

/**
 * Mendapatkan detail berita berdasarkan slug
 */
export const getBeritaBySlug = async (slug: string): Promise<Berita> => {
  const response = await apiClient.get<Berita>(`/berita/${slug}`);
  return response.data;
};

/**
 * Mendapatkan semua kategori berita
 */
export const getAllKategori = async (): Promise<KategoriBerita[]> => {
    const response = await apiClient.get<KategoriBerita[]>('/kategori');
    return response.data;
  };

/**
 * Membuat berita baru (Admin only)
 */
export const createBerita = async (data: CreateBeritaData): Promise<Berita> => {
  const formData = new FormData();
  formData.append('judul', data.judul);
  formData.append('ringkasan', data.ringkasan);
  formData.append('isi', data.isi);
  formData.append('penulis', data.penulis);
  formData.append('tanggal', data.tanggal);
  if (data.isHighlight !== undefined) {
    formData.append('isHighlight', String(data.isHighlight));
  }
  formData.append('kategoriIds', JSON.stringify(data.kategoriIds));
  formData.append('gambar', data.gambar);

  const response = await apiClient.post<Berita>('/berita', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Mengupdate berita yang sudah ada (Admin only)
 */
export const updateBerita = async (id: string, data: UpdateBeritaData): Promise<Berita> => {
  const formData = new FormData();
  
  if (data.judul) formData.append('judul', data.judul);
  if (data.ringkasan) formData.append('ringkasan', data.ringkasan);
  if (data.isi) formData.append('isi', data.isi);
  if (data.penulis) formData.append('penulis', data.penulis);
  if (data.tanggal) formData.append('tanggal', data.tanggal);
  if (data.isHighlight !== undefined) formData.append('isHighlight', String(data.isHighlight));
  if (data.kategoriIds) formData.append('kategoriIds', JSON.stringify(data.kategoriIds));
  if (data.gambar) formData.append('gambar', data.gambar);

  const response = await apiClient.put<Berita>(`/berita/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Menghapus berita (Admin only)
 */
export const deleteBerita = async (id: string): Promise<void> => {
  await apiClient.delete(`/berita/${id}`);
};