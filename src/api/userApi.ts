import { apiClient } from './apiClient';

export interface UserData {
  id: string;
  namaDepan: string;
  namaBelakang: string;
  nomorHp: string;
  email: string;
  role: 'ADMIN' | 'USER';
}

export interface CreateUserData {
  namaDepan: string;
  namaBelakang: string;
  nomorHp: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
}

export const getUsers = () => 
  apiClient.get<UserData[]>('/users').then(response => response.data);

export const createUser = (userData: CreateUserData) => 
  apiClient.post<UserData>('/users', userData).then(response => response.data);

export const updateUser = (id: string, userData: Partial<UserData>) => 
  apiClient.put<UserData>(`/users/${id}`, userData).then(response => response.data);

export const getUserById = (id: string): Promise<UserData> => 
  apiClient.get<UserData>(`/users/${id}`).then(response => response.data);

export const deleteUser = (id: string) => 
  apiClient.delete(`/users/${id}`).then(response => response.data);

export const getCurrentUser = (): Promise<UserData> => 
  apiClient.get<UserData>('/auth/me').then(response => response.data);