// src/api/submissionApi.ts
import { apiClient } from "./apiClient";
import axios, { AxiosError } from "axios";

export type SubmissionStatus = "DIPROSES" | "SELESAI";

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

interface ValidationErrorDetail {
  field?: string;
  message: string;
}

interface ValidationErrorResponse {
  error: string;
  details: ValidationErrorDetail[];
  statusCode: 400;
}

interface BackendErrorResponse {
  error: string;
  message?: string;
  statusCode?: number;
}

// Helper untuk mengecek apakah error adalah validation error
export const isValidationError = (
  error: unknown
): error is AxiosError<ValidationErrorResponse> => {
  if (!axios.isAxiosError(error)) return false;
  const response = error.response?.data;
  return error.response?.status === 400 && !!response?.details;
};

// Helper untuk format validasi error
export const formatValidationErrors = (
  error: AxiosError<ValidationErrorResponse>
): string[] => {
  return (
    error.response?.data.details.map((detail) => {
      if (detail.field === "keterangan") {
        return "Keterangan minimal harus 10 karakter";
      }
      return detail.message;
    }) || ["Terjadi kesalahan validasi"]
  );
};

export const handleSubmissionError = (
  error: unknown
): { message: string; isRateLimit: boolean } => {
  if (isValidationError(error)) {
    const messages = formatValidationErrors(error);
    return {
      message: messages.join("\n"),
      isRateLimit: false,
    };
  }

  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data as BackendErrorResponse;

    switch (error.response?.status) {
      case 429:
        return {
          message:
            "Terlalu banyak permintaan. Silakan tunggu 1 menit sebelum mencoba kembali.",
          isRateLimit: true,
        };
      case 413:
        return {
          message: "Ukuran file terlalu besar. Maksimal 5MB",
          isRateLimit: false,
        };
      case 415:
        return {
          message: "Format file tidak didukung. Gunakan format .doc atau .docx",
          isRateLimit: false,
        };
      default:
        return {
          message:
            errorData?.message || "Terjadi kesalahan saat mengirim dokumen",
          isRateLimit: false,
        };
    }
  }

  return {
    message: "Terjadi kesalahan yang tidak diketahui",
    isRateLimit: false,
  };
};

// API Functions
export const submitDocument = async (
  data: CreateSubmissionData
): Promise<{ message: string; id: string }> => {
  try {
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
  } catch (error) {
    throw error; // Let the component handle the error with our helper functions
  }
};

export const getSubmissionsByWhatsapp = async (
  whatsapp: string
): Promise<Submission[]> => {
  const response = await apiClient.get<Submission[]>(
    `/submissions/whatsapp/${whatsapp}`
  );
  return response.data;
};

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

export const deleteSubmission = async (id: string): Promise<void> => {
  await apiClient.delete(`/submissions/${id}`);
};
