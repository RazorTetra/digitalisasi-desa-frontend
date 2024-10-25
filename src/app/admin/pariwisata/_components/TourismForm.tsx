/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/admin/pariwisata/_components/TourismForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Modifikasi schema untuk menghindari FileList
const tourismFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama destinasi harus diisi")
    .max(100, "Nama destinasi maksimal 100 karakter"),
  description: z
    .string()
    .min(1, "Deskripsi harus diisi")
    .max(255, "Deskripsi maksimal 255 karakter"),
  location: z
    .string()
    .min(1, "Lokasi harus diisi")
    .max(255, "Lokasi maksimal 255 karakter"),
  mainImage: z
    .any()
    .optional()
    .refine((files) => {
      if (!files?.[0]) return false;
      return files?.[0] instanceof File;
    }, "Gambar utama harus diupload")
    .refine((files) => {
      if (!files?.[0]) return false;
      return files?.[0].size <= MAX_FILE_SIZE;
    }, "Ukuran maksimal file adalah 5MB")
    .refine((files) => {
      if (!files?.[0]) return false;
      return ACCEPTED_FILE_TYPES.includes(files?.[0].type);
    }, "Format file harus .jpg, .png, atau .webp"),
  gallery: z
    .any()
    .optional()
    .refine((files) => {
      if (!files) return true; // Gallery is optional
      return Array.from(files).every((file) => file instanceof File);
    }, "File tidak valid")
    .refine((files) => {
      if (!files) return true;
      return Array.from(files).length <= 10;
    }, "Maksimal 10 gambar galeri")
    .refine((files) => {
      if (!files) return true;
      return Array.from(files).every((file) => file.size <= MAX_FILE_SIZE);
    }, "Setiap file maksimal 5MB")
    .refine((files) => {
      if (!files) return true;
      return Array.from(files).every((file) =>
        ACCEPTED_FILE_TYPES.includes(file.type)
      );
    }, "Format file harus .jpg, .png, atau .webp"),
});

type FormValues = z.infer<typeof tourismFormSchema>;

interface TourismFormProps {
  defaultValues?: Partial<FormValues>;
  isSubmitting: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
}

export function TourismForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: TourismFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(tourismFormSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      location: defaultValues?.location || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Destinasi</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mainImage"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Gambar Utama</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => onChange(e.target.files)}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gallery"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Galeri (Maksimal 10 gambar)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={(e) => onChange(e.target.files)}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan"
          )}
        </Button>
      </form>
    </Form>
  );
}
