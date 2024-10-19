// src/api/apiClient.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const handleLogout = () => {
  // Clear localStorage
  localStorage.clear();

  // Clear cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });

  // Show simple alert
  alert("Sesi Anda telah berakhir. Silakan login kembali.");

  // Redirect to login page
  window.location.href = '/login';
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      handleLogout();
    }
    return Promise.reject(error);
  }
);

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw error.response?.data || new Error('An error occurred');
  } else if (error instanceof Error) {
    throw new Error(error.message);
  } else {
    throw new Error('An unknown error occurred');
  }
};

const authenticatedRequest = async <T>(requestFunction: () => Promise<T>): Promise<T> => {
  try {
    const response = await requestFunction();
    return response;
  } catch (error) {
    console.error('Error in authenticated request:', error);
    throw handleError(error);
  }
};

export { apiClient, handleError, authenticatedRequest };