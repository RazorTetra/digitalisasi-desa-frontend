// src/schemas/registerSchema.ts
import * as z from "zod";

export const registerSchema = z.object({
  namaDepan: z.string().min(1, { message: "Nama depan harus diisi" }),
  namaBelakang: z.string().min(1, { message: "Nama belakang harus diisi" }),
  nomorHp: z.string().min(10, { message: "Nomor HP tidak valid" }),
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  konfirmasiPassword: z.string().min(8, { message: "Konfirmasi password minimal 8 karakter" }),
}).refine((data) => data.password === data.konfirmasiPassword, {
  message: "Password dan konfirmasi password harus sama",
  path: ["konfirmasiPassword"],
});

export type RegisterForm = z.infer<typeof registerSchema>;