// src/api/submissionApi.ts
import { apiClient } from './apiClient';

export type SubmissionStatus = 'DIPROSES' | 'SELESAI';

// Interfaces
export interface Submission {
  id: string;
  pengirim: string;
  whatsapp: string;
  kategori: string;
  keterangan: string;
  fileUrl: string;
  fileName: string;
  status: SubmissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubmissionStats {
  kategori: string;
  total: number;
  statusCount: {
    DIPROSES: number;
    SELESAI: number;
  };
}

export interface CreateSubmissionData {
  pengirim: string;
  whatsapp: string;
  kategori: string;
  keterangan: string;
  file: File;
}

export interface UpdateStatusData {
  status: SubmissionStatus;
}

// Public Endpoints
export const submitDocument = async (
  data: CreateSubmissionData
): Promise<{ message: string; id: string }> => {
  const formData = new FormData();
  formData.append("pengirim", data.pengirim);
  formData.append("whatsapp", data.whatsapp);
  formData.append("kategori", data.kategori);
  formData.append("keterangan", data.keterangan);
  formData.append("file", data.file);

  const response = await apiClient.post<{ message: string; id: string }>(
    "/submissions",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const getSubmissionsByWhatsapp = async (
  whatsapp: string
): Promise<Submission[]> => {
  const response = await apiClient.get<Submission[]>(
    `/submissions/whatsapp/${whatsapp}`
  );
  return response.data;
};

// Admin Endpoints
export const getAllSubmissions = async (): Promise<Submission[]> => {
  const response = await apiClient.get<Submission[]>("/submissions");
  return response.data;
};

export const getSubmissionById = async (id: string): Promise<Submission> => {
  const response = await apiClient.get<Submission>(`/submissions/${id}`);
  return response.data;
};

export const getSubmissionStats = async (): Promise<SubmissionStats[]> => {
  const response = await apiClient.get<SubmissionStats[]>("/submissions/stats");
  return response.data;
};

export const deleteSubmission = async (id: string): Promise<void> => {
  await apiClient.delete(`/submissions/${id}`);
};

// Type guards untuk error handling
export interface ValidationError {
  error: string;
  details: Array<{ message: string }>;
}

export interface FileError {
  error: string;
}

export interface RateLimitError {
  error: string;
}

export const isValidationError = (error: unknown): error is ValidationError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    "details" in error &&
    Array.isArray((error as ValidationError).details)
  );
};

export const isFileError = (error: unknown): error is FileError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as FileError).error === "string" &&
    ((error as FileError).error.includes("Format file") ||
      (error as FileError).error.includes("Ukuran file"))
  );
};

export const isRateLimitError = (error: unknown): error is RateLimitError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "error" in error &&
    typeof (error as RateLimitError).error === "string" &&
    (error as RateLimitError).error.includes("Terlalu banyak pengiriman")
  );
};

export const updateSubmissionStatus = async (
  id: string,
  data: UpdateStatusData
): Promise<{ message: string; status: SubmissionStatus }> => {
  const response = await apiClient.patch<{
    message: string;
    status: SubmissionStatus;
  }>(`/submissions/${id}/status`, data);
  return response.data;
};
