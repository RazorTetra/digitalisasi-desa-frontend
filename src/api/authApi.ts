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

export interface User {
  id: string;
  namaDepan: string;
  namaBelakang: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface LoginResponse {
  message: string;
  user: User;
}

export const registerUser = (userData: RegisterUserData) => 
  authenticatedRequest(() => apiClient.post('/auth/register', userData));

export const loginUser = (loginData: LoginData): Promise<LoginResponse> => 
  apiClient.post('/auth/login', loginData).then(response => response.data);

export const logout = () => 
  apiClient.post('/auth/logout').then(response => response.data);