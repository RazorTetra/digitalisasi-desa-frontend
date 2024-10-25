"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import * as z from "zod";
import { format } from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Berita, CreateBeritaData, KategoriBerita } from "@/api/beritaApi";
import { RichTextEditor } from "./RichTextEditor";

interface FormValues {
  judul: string;
  ringkasan: string;
  isi: string;
  penulis: string;
  tanggal: Date;
  kategoriIds: string[];
  isHighlight: boolean;
}
const formSchema = z.object({
  judul: z.string().min(1, "Judul harus diisi"),
  ringkasan: z.string().min(1, "Ringkasan harus diisi"),
  isi: z.string().min(1, "Isi berita harus diisi"),
  penulis: z.string().min(1, "Penulis harus diisi"),
  tanggal: z.date(),
  kategoriIds: z.array(z.string()).min(1, "Minimal pilih satu kategori"),
  isHighlight: z.boolean().default(false),
});

interface BeritaFormProps {
  initialData?: Berita;
  kategori: KategoriBerita[];
  onSubmit: (data: CreateBeritaData) => Promise<void>;
  isSubmitting?: boolean;
}

export function BeritaForm({
  initialData,
  kategori,
  onSubmit,
  isSubmitting,
}: BeritaFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.gambarUrl || null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: initialData?.judul || "",
      ringkasan: initialData?.ringkasan || "",
      isi: initialData?.isi || "",
      penulis: initialData?.penulis || "",
      tanggal: initialData ? new Date(initialData.tanggal) : new Date(),
      kategoriIds: initialData?.kategori.map((k) => k.id) || [],
      isHighlight: initialData?.isHighlight || false,
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      ListItem,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
    ],
    content: initialData?.isi || "",
    onUpdate: ({ editor }) => {
      form.setValue("isi", editor.getHTML());
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!selectedFile) {
      form.setError("root", { message: "Gambar berita harus diunggah" });
      return;
    }

    const beritaData: CreateBeritaData = {
      judul: values.judul,
      ringkasan: values.ringkasan,
      isi: values.isi,
      penulis: values.penulis,
      tanggal: values.tanggal.toISOString(),
      kategoriIds: values.kategoriIds,
      isHighlight: values.isHighlight,
      gambar: selectedFile,
    };

    await onSubmit(beritaData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      form.setError("root", { message: "Ukuran file maksimal 5MB" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      form.setError("root", { message: "File harus berupa gambar" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setSelectedFile(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Form fields remain the same until the image upload field */}
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Judul berita..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ringkasan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ringkasan</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ringkasan singkat berita..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isi"
          render={({}) => (
            <FormItem>
              <FormLabel>Isi Berita</FormLabel>
              <FormControl>
                <RichTextEditor editor={editor} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="penulis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penulis</FormLabel>
              <FormControl>
                <Input placeholder="Nama penulis..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tanggal"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tanggal</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pilih tanggal</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kategoriIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Select
                  value={field.value[0] || ""}
                  onValueChange={(value) => field.onChange([value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategori.map((kat) => (
                      <SelectItem key={kat.id} value={kat.id}>
                        {kat.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isHighlight"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Tampilkan sebagai berita highlight</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modified image upload section */}
        <FormLabel>Gambar Berita</FormLabel>
        <FormControl>
          <div className="space-y-4">
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <div className="relative w-full h-[200px] rounded-lg overflow-hidden border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Format: JPG, PNG, atau WebP. Maksimal 5MB.
            </p>
          </div>
        </FormControl>
        <FormMessage />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline">
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
