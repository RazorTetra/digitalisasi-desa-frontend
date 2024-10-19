import { apiClient } from "./apiClient";

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
  role: "ADMIN" | "USER";
}

export interface LoginResponse {
  message: string;
  user: User;
}

export const registerUser = (userData: RegisterUserData) =>
  apiClient.post("/auth/register", userData);

export const loginUser = async (
  loginData: LoginData
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    loginData
  );
  // Simpan data user ke localStorage
  localStorage.setItem("userData", JSON.stringify(response.data.user));
  document.cookie = `userData=${JSON.stringify(response.data.user)}; path=/; max-age=86400; secure; samesite=strict`;
  
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  localStorage.removeItem("userData");
  document.cookie = `userData=${JSON.stringify(response.data.user)}; path=/; max-age=86400; secure; samesite=strict`;
  
  return response.data;
};

export const getCurrentUser = (): Promise<User> =>
  apiClient.get<User>("/auth/me").then((response) => response.data);
