/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/admin/pariwisata/_components/TourismForm.tsx
import React from 'react';
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
import Image from 'next/image';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const isValidFile = (file: unknown): file is File => {
  return file instanceof File;
};

interface ExistingFiles {
  mainImage?: string;
  gallery?: string[];
}

// Schema yang mendukung baik File maupun URL string
const tourismFormSchema = z.object({
  name: z.string().min(1, "Nama destinasi harus diisi").max(100, "Nama destinasi maksimal 100 karakter"),
  description: z.string().min(1, "Deskripsi harus diisi").max(255, "Deskripsi maksimal 255 karakter"),
  location: z.string().min(1, "Lokasi harus diisi").max(255, "Lokasi maksimal 255 karakter"),
  mainImage: z.union([
    z.custom<FileList>()
      .refine((files) => files?.length === 1, "Gambar utama harus diupload")
      .refine((files) => {
        if (!files?.[0]) return false;
        const file = files[0];
        return isValidFile(file) && file.size <= MAX_FILE_SIZE;
      }, "Ukuran maksimal file adalah 5MB")
      .refine((files) => {
        if (!files?.[0]) return false;
        const file = files[0];
        return isValidFile(file) && ACCEPTED_FILE_TYPES.includes(file.type as typeof ACCEPTED_FILE_TYPES[number]);
      }, "Format file harus .jpg, .png, atau .webp"),
    z.string().url("URL gambar tidak valid").optional()
  ]).optional(),
  gallery: z.union([
    z.custom<FileList>()
      .refine((files) => {
        if (!files) return true;
        return Array.from(files).every(file => isValidFile(file));
      }, "File tidak valid")
      .refine((files) => {
        if (!files) return true;
        return files.length <= 10;
      }, "Maksimal 10 gambar galeri")
      .refine((files) => {
        if (!files) return true;
        return Array.from(files).every(file => {
          return isValidFile(file) && file.size <= MAX_FILE_SIZE;
        });
      }, "Setiap file maksimal 5MB")
      .refine((files) => {
        if (!files) return true;
        return Array.from(files).every(file => {
          return isValidFile(file) && ACCEPTED_FILE_TYPES.includes(file.type as typeof ACCEPTED_FILE_TYPES[number]);
        });
      }, "Format file harus .jpg, .png, atau .webp"),
    z.array(z.string().url("URL gambar tidak valid")).optional()
  ]).optional(),
});

export type TourismFormValues = z.infer<typeof tourismFormSchema>;

interface TourismFormProps {
  defaultValues?: {
    name?: string;
    description?: string;
    location?: string;
    mainImage?: string;
    gallery?: string[];
  };
  isSubmitting: boolean;
  onSubmit: (values: TourismFormValues) => Promise<void>;
}

export function TourismForm({ defaultValues, isSubmitting, onSubmit }: TourismFormProps) {
  const form = useForm<TourismFormValues>({
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
              {defaultValues?.mainImage && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Gambar saat ini:</p>
                  <div className="relative w-full h-40">
                    <Image
                      src={defaultValues.mainImage}
                      alt="Current main image"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES.join(',')}
                  onChange={(e) => onChange(e.target.files)}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                {defaultValues?.mainImage 
                  ? "Upload file baru untuk mengganti gambar saat ini" 
                  : "Upload gambar utama destinasi wisata"}
              </p>
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
              {defaultValues?.gallery && defaultValues.gallery.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Galeri saat ini:</p>
                  <div className="grid grid-cols-3 gap-4">
                    {defaultValues.gallery.map((url, index) => (
                      <div key={index} className="relative aspect-square">
                        <Image
                          src={url}
                          alt={`Gallery image ${index + 1}`}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES.join(',')}
                  multiple
                  onChange={(e) => onChange(e.target.files)}
                  disabled={isSubmitting}
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                {defaultValues?.gallery?.length 
                  ? "Upload file baru untuk mengganti galeri saat ini" 
                  : "Upload gambar-gambar untuk galeri"}
              </p>
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
            'Simpan'
          )}
        </Button>
      </form>
    </Form>
  );
}