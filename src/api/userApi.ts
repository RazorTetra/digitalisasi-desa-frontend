// src/api/userApi.ts
import { apiClient } from './apiClient';

export interface UserData {
  namaDepan: string;
  namaBelakang: string;
  nomorHp: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export const getUsers = () => 
  apiClient.get('/users').then(response => response.data);

export const createUser = (userData: UserData) => 
  apiClient.post('/users', userData).then(response => response.data);

export const updateUser = (id: string, userData: Partial<UserData>) => 
  apiClient.put(`/users/${id}`, userData).then(response => response.data);

export const deleteUser = (id: string) => 
  apiClient.delete(`/users/${id}`).then(response => response.data);