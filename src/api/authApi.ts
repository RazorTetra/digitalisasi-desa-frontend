// src/api/authApi.ts
import { apiClient, authenticatedRequest } from './apiClient';

export interface RegisterUserData {
  namaDepan: string;
  namaBelakang: string;
  nomorHp: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const registerUser = (userData: RegisterUserData) => 
  authenticatedRequest(() => apiClient.post('/auth/register', userData));

export const loginUser = (loginData: LoginData) => 
  authenticatedRequest(() => apiClient.post('/auth/login', loginData));

export const logout = () => 
  apiClient.post('/auth/logout').then(response => response.data);