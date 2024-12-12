// src/app/(main)/kirim-surat/_components/submission-form.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  submitDocument,
  CreateSubmissionData,
  isValidationError,
  isFileError,
  isRateLimitError
} from '@/api/submissionApi';

interface FormInputs {
  pengirim: string;
  whatsapp: string;
  kategori: string;
  keterangan: string;
  file: FileList;
}

export function SubmissionForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    setIsLoading(true);
    try {
      const submissionData: CreateSubmissionData = {
        pengirim: data.pengirim,
        whatsapp: data.whatsapp,
        kategori: data.kategori,
        keterangan: data.keterangan,
        file: data.file[0]
      };

      const response = await submitDocument(submissionData);
      
      toast({
        title: "Berhasil!",
        description: response.message,
      });
      
      reset();
    } catch (error) {
      if (isValidationError(error)) {
        error.details.forEach((detail) => {
          toast({
            title: "Error",
            description: detail.message,
            variant: "destructive",
          });
        });
      } else if (isFileError(error)) {
        toast({
          title: "Error File",
          description: error.error,
          variant: "destructive",
        });
      } else if (isRateLimitError(error)) {
        toast({
          title: "Terlalu Banyak Permintaan",
          description: error.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat mengirim dokumen",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="pengirim">Nama Pengirim</Label>
            <Input
              id="pengirim"
              {...register("pengirim", { required: "Nama pengirim wajib diisi" })}
              placeholder="Masukkan nama lengkap"
              disabled={isLoading}
            />
            {errors.pengirim && (
              <p className="text-sm text-red-500">{errors.pengirim.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
            <Input
              id="whatsapp"
              {...register("whatsapp", {
                required: "Nomor WhatsApp wajib diisi",
                pattern: {
                  value: /^(\+62|62|0)8[1-9][0-9]{8,11}$/,
                  message: "Format nomor WhatsApp tidak valid"
                }
              })}
              placeholder="Contoh: 081234567890"
              disabled={isLoading}
            />
            {errors.whatsapp && (
              <p className="text-sm text-red-500">{errors.whatsapp.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="kategori">Kategori Surat</Label>
            <Input
              id="kategori"
              {...register("kategori", { required: "Kategori surat wajib diisi" })}
              placeholder="Contoh: Surat Keterangan"
              disabled={isLoading}
            />
            {errors.kategori && (
              <p className="text-sm text-red-500">{errors.kategori.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Textarea
              id="keterangan"
              {...register("keterangan", { required: "Keterangan wajib diisi" })}
              placeholder="Jelaskan keperluan surat"
              disabled={isLoading}
            />
            {errors.keterangan && (
              <p className="text-sm text-red-500">{errors.keterangan.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Upload File</Label>
            <Input
              id="file"
              type="file"
              accept=".doc,.docx"
              {...register("file", { required: "File surat wajib diupload" })}
              disabled={isLoading}
            />
            {errors.file && (
              <p className="text-sm text-red-500">{errors.file.message}</p>
            )}
            <p className="text-sm text-gray-500">
              Format yang diterima: .doc, .docx (Max. 5MB)
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Mengirim..." : "Kirim Surat"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}