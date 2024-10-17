// src/api/apiClient.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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
    console.log('Response:', response);
    return response;
  } catch (error) {
    console.error('Error in authenticated request:', error);
    throw handleError(error);
  }
};

export { apiClient, handleError, authenticatedRequest };