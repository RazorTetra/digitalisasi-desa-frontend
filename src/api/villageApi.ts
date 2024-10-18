// src/api/villageApi.ts
import { apiClient } from './apiClient';

export interface VillageInfo {
  id: string;
  history: string;
}

export interface VillageStructure {
  id: string;
  position: string;
  name: string;
}

export interface GalleryImage {
  id: string;
  imageUrl: string;
  description?: string;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
}

// Village Info
export const getVillageInfo = (): Promise<VillageInfo> =>
  apiClient.get('/village/info').then(response => response.data);

export const updateVillageInfo = (info: Partial<VillageInfo>): Promise<VillageInfo> =>
  apiClient.put('/village/info', info).then(response => response.data);

// Village Structure
export const getVillageStructure = (): Promise<VillageStructure[]> =>
  apiClient.get('/village/structure').then(response => response.data);

export const createVillageStructure = (structure: Omit<VillageStructure, 'id'>): Promise<VillageStructure> =>
  apiClient.post('/village/structure', structure).then(response => response.data);

export const updateVillageStructure = (id: string, structure: Partial<VillageStructure>): Promise<VillageStructure> =>
  apiClient.put(`/village/structure/${id}`, structure).then(response => response.data);

export const deleteVillageStructure = (id: string): Promise<void> =>
  apiClient.delete(`/village/structure/${id}`).then(response => response.data);

// Gallery
export const getGallery = (): Promise<GalleryImage[]> =>
  apiClient.get('/village/gallery').then(response => response.data);

export const addGalleryImage = (formData: FormData): Promise<GalleryImage> =>
  apiClient.post('/village/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(response => response.data);

export const deleteGalleryImage = (id: string): Promise<void> =>
  apiClient.delete(`/village/gallery/${id}`).then(response => response.data);

// Social Media
export const getSocialMedia = (): Promise<SocialMedia[]> =>
  apiClient.get('/village/social-media').then(response => response.data);

export const updateSocialMedia = (id: string, socialMedia: { url: string }): Promise<SocialMedia> =>
  apiClient.put(`/village/social-media/${id}`, socialMedia).then(response => response.data);

