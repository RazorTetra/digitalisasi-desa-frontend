import { apiClient } from './apiClient';

export interface FormatSurat {
  id: string;
  nama: string;
  fileUrl: string;
  filename: string;
  createdAt: string;
  updatedAt: string;
  downloadUrl: string;
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


