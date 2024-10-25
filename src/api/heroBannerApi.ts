// src/api/heroBannerApi.ts
import { apiClient } from './apiClient';

export interface HeroBanner {
  id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getHeroBanner = (): Promise<HeroBanner> => 
  apiClient.get<HeroBanner>('/hero-banner').then(response => response.data);

export const updateHeroBanner = (image: File): Promise<HeroBanner> => {
  const formData = new FormData();
  formData.append('image', image);

  return apiClient.put<HeroBanner>('/hero-banner', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(response => response.data);
};