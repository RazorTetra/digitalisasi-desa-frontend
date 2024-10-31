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
import Image from "next/image";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const MAX_GALLERY_IMAGES = 10;

// Type Guards
const isValidFile = (file: unknown): file is File => {
  return file instanceof File;
};

// Components
const CurrentImage = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative w-full h-40">
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      className="object-cover rounded-md"
      priority={false}
      loading="lazy"
      quality={75}
    />
  </div>
);

const GalleryImage = ({ src, index }: { src: string; index: number }) => (
  <div className="relative aspect-square">
    <Image
      src={src}
      alt={`Gallery image ${index + 1}`}
      fill
      sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
      className="object-cover rounded-md"
      priority={false}
      loading="lazy"
      quality={75}
    />
  </div>
);

const FileInput = ({
  onChange,
  disabled,
  multiple = false,
  ...props
}: {
  onChange: (files: FileList | null) => void;
  disabled: boolean;
  multiple?: boolean;
}) => (
  <Input
    type="file"
    accept={ACCEPTED_FILE_TYPES.join(",")}
    onChange={(e) => onChange(e.target.files)}
    disabled={disabled}
    multiple={multiple}
    {...props}
  />
);

// Schema
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
    .union([
      z
        .custom<FileList>()
        .refine((files) => files?.length === 1, "Gambar utama harus diupload")
        .refine(
          (files) =>
            files?.[0] &&
            isValidFile(files[0]) &&
            files[0].size <= MAX_FILE_SIZE,
          "Ukuran maksimal file adalah 5MB"
        )
        .refine(
          (files) =>
            files?.[0] &&
            isValidFile(files[0]) &&
            ACCEPTED_FILE_TYPES.includes(
              files[0].type as (typeof ACCEPTED_FILE_TYPES)[number]
            ),
          "Format file harus .jpg, .png, atau .webp"
        ),
      z.string().url("URL gambar tidak valid").optional(),
    ])
    .optional(),
  gallery: z
    .union([
      z
        .custom<FileList>()
        .refine(
          (files) =>
            !files || Array.from(files).every((file) => isValidFile(file)),
          "File tidak valid"
        )
        .refine(
          (files) => !files || files.length <= MAX_GALLERY_IMAGES,
          `Maksimal ${MAX_GALLERY_IMAGES} gambar galeri`
        )
        .refine(
          (files) =>
            !files ||
            Array.from(files).every(
              (file) => isValidFile(file) && file.size <= MAX_FILE_SIZE
            ),
          "Setiap file maksimal 5MB"
        )
        .refine(
          (files) =>
            !files ||
            Array.from(files).every(
              (file) =>
                isValidFile(file) &&
                ACCEPTED_FILE_TYPES.includes(
                  file.type as (typeof ACCEPTED_FILE_TYPES)[number]
                )
            ),
          "Format file harus .jpg, .png, atau .webp"
        ),
      z.array(z.string().url("URL gambar tidak valid")).optional(),
    ])
    .optional(),
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

export function TourismForm({
  defaultValues,
  isSubmitting,
  onSubmit,
}: TourismFormProps) {
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
        {/* Name Field */}
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

        {/* Description Field */}
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

        {/* Location Field */}
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

        {/* Main Image Field */}
        <FormField
          control={form.control}
          name="mainImage"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Gambar Utama</FormLabel>
              {defaultValues?.mainImage && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Gambar saat ini:
                  </p>
                  <CurrentImage
                    src={defaultValues.mainImage}
                    alt="Current main image"
                  />
                </div>
              )}
              <FormControl>
                <FileInput
                  onChange={onChange}
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

        {/* Gallery Field */}
        <FormField
          control={form.control}
          name="gallery"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>
                Galeri (Maksimal {MAX_GALLERY_IMAGES} gambar)
              </FormLabel>
              {defaultValues?.gallery && defaultValues.gallery.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Galeri saat ini:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {defaultValues.gallery.map((url, index) => (
                      <GalleryImage
                        key={`${url}-${index}`}
                        src={url}
                        index={index}
                      />
                    ))}
                  </div>
                </div>
              )}
              <FormControl>
                <FileInput
                  onChange={onChange}
                  disabled={isSubmitting}
                  multiple
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

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
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
