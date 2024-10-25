// src/api/tourismApi.ts
import { apiClient } from './apiClient';

// Interfaces
export interface Tourism {
  id: string;
  name: string;
  description: string;
  image: string;
  location: string;
  gallery: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTourismData {
  name: string;
  description: string;
  location: string;
  mainImage: File;
  gallery: File[];
}

export interface UpdateTourismData {
  name?: string;
  description?: string;
  location?: string;
  mainImage?: File;
  gallery?: File[];
}

/**
 * Mendapatkan semua destinasi wisata
 * @returns Promise<Tourism[]>
 */
export const getAllTourism = async (): Promise<Tourism[]> => {
  const response = await apiClient.get<Tourism[]>('/tourism');
  return response.data;
};

/**
 * Mendapatkan detail destinasi wisata berdasarkan ID
 * @param id - ID destinasi wisata
 * @returns Promise<Tourism>
 */
export const getTourismById = async (id: string): Promise<Tourism> => {
  const response = await apiClient.get<Tourism>(`/tourism/${id}`);
  return response.data;
};

/**
 * Membuat destinasi wisata baru (Admin only)
 * @param data - Data destinasi wisata yang akan dibuat
 * @returns Promise<Tourism>
 */
export const createTourism = async (data: CreateTourismData): Promise<Tourism> => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('description', data.description);
  formData.append('location', data.location);
  formData.append('mainImage', data.mainImage);

  // Append gallery images
  data.gallery.forEach((image) => {
    formData.append('gallery', image);
  });

  const response = await apiClient.post<Tourism>('/tourism', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Mengupdate destinasi wisata (Admin only)
 * @param id - ID destinasi wisata
 * @param data - Data yang akan diupdate
 * @returns Promise<Tourism>
 */
export const updateTourism = async (id: string, data: UpdateTourismData): Promise<Tourism> => {
  const formData = new FormData();

  // Append only defined fields
  if (data.name) formData.append('name', data.name);
  if (data.description) formData.append('description', data.description);
  if (data.location) formData.append('location', data.location);
  if (data.mainImage) formData.append('mainImage', data.mainImage);
  
  // Append gallery images if provided
  if (data.gallery) {
    data.gallery.forEach((image) => {
      formData.append('gallery', image);
    });
  }

  const response = await apiClient.put<Tourism>(`/tourism/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Menghapus destinasi wisata (Admin only)
 * @param id - ID destinasi wisata yang akan dihapus
 * @returns Promise<void>
 */
export const deleteTourism = async (id: string): Promise<void> => {
  await apiClient.delete(`/tourism/${id}`);
};

// Error Types untuk type checking
export interface ApiError {
  error: string;
  details?: {
    code: string;
    maximum?: number;
    type?: string;
    inclusive?: boolean;
    exact?: boolean;
    message: string;
    path: string[];
  }[];
}

export interface FileTypeError {
  error: string;
}

export interface AuthError {
  error: string;
  code: string;
}

// Type guard untuk mengecek tipe error
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as ApiError).error === 'string'
  );
};

export const isFileTypeError = (error: unknown): error is FileTypeError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as FileTypeError).error === 'string' &&
    (error as FileTypeError).error.includes('format allowed')
  );
};

export const isAuthError = (error: unknown): error is AuthError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    'code' in error &&
    typeof (error as AuthError).code === 'string'
  );
};