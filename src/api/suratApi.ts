import { apiClient } from './apiClient';

export interface FormatSurat {
  id: string;
  nama: string;
  fileUrl: string;
  filename: string;
  totalDownloads: number; 
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
}

export interface DownloadStats {
  month: string;
  year: number;
  downloadCount: number;
}

// Get semua format surat
export const getAllFormatSurat = (): Promise<FormatSurat[]> =>
  apiClient.get('/surat/format').then(response => response.data);

// Upload format surat baru
export const uploadFormatSurat = (formData: FormData): Promise<FormatSurat> =>
  apiClient.post('/surat/format', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data);

// Hapus format surat
export const deleteFormatSurat = (id: string): Promise<void> =>
  apiClient.delete(`/surat/format/${id}`);

// Track download format surat
export const trackFormatSuratDownload = (id: string): Promise<void> =>
  apiClient.post(`/surat/format/${id}/download`);

// Get statistik download format surat
export const getFormatSuratStats = (id: string, year?: number): Promise<DownloadStats[]> =>
  apiClient.get(`/surat/format/${id}/stats`, {
    params: year ? { year } : undefined
  }).then(response => response.data);