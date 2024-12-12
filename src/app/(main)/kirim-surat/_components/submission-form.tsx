// src/app/(main)/kirim-surat/_components/submission-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  submitDocument,
  CreateSubmissionData,
  handleSubmissionError,
} from "@/api/submissionApi";
import { SuccessDialog } from "./success-dialog";
import { ErrorDialog } from "./error-dialog";

interface FormInputs {
  pengirim: string;
  whatsapp: string;
  kategori: string;
  keterangan: string;
  file: FileList;
}

const COOLDOWN_TIME = 60000; // 1 menit dalam milliseconds

export function SubmissionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [errorState, setErrorState] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });
  const [cooldownTime, setCooldownTime] = useState(0);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    if (cooldownTime <= 0) return;

    const timer = setInterval(() => {
      const remaining = lastSubmitTime + COOLDOWN_TIME - Date.now();
      if (remaining <= 0) {
        setCooldownTime(0);
        clearInterval(timer);
      } else {
        setCooldownTime(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownTime, lastSubmitTime]);

  const onSubmit = async (data: FormInputs) => {
    if (Date.now() - lastSubmitTime < COOLDOWN_TIME) {
      setErrorState({
        show: true,
        message: "Harap tunggu sebelum mengirim surat kembali",
      });
      return;
    }

    setIsLoading(true);
    try {
      const submissionData: CreateSubmissionData = {
        pengirim: data.pengirim,
        whatsapp: data.whatsapp,
        kategori: data.kategori,
        keterangan: data.keterangan,
        file: data.file[0],
      };

      await submitDocument(submissionData);
      reset();
      setShowSuccessDialog(true);
      setLastSubmitTime(Date.now());
      setCooldownTime(COOLDOWN_TIME);
    } catch (error) {
      const errorResult = handleSubmissionError(error);
      setErrorState({
        show: true,
        message: errorResult.message,
      });

      if (errorResult.isRateLimit) {
        setLastSubmitTime(Date.now());
        setCooldownTime(COOLDOWN_TIME);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pengirim">Nama Pengirim</Label>
              <Input
                id="pengirim"
                {...register("pengirim", {
                  required: "Nama pengirim wajib diisi",
                })}
                placeholder="Masukkan nama lengkap"
                disabled={isLoading || cooldownTime > 0}
              />
              {errors.pengirim && (
                <p className="text-sm text-red-500">
                  {errors.pengirim.message}
                </p>
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
                    message: "Format nomor WhatsApp tidak valid",
                  },
                })}
                placeholder="Contoh: 081234567890"
                disabled={isLoading || cooldownTime > 0}
              />
              {errors.whatsapp && (
                <p className="text-sm text-red-500">
                  {errors.whatsapp.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori Surat</Label>
              <Input
                id="kategori"
                {...register("kategori", {
                  required: "Kategori surat wajib diisi",
                })}
                placeholder="Contoh: Surat Keterangan"
                disabled={isLoading || cooldownTime > 0}
              />
              {errors.kategori && (
                <p className="text-sm text-red-500">
                  {errors.kategori.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                {...register("keterangan", {
                  required: "Keterangan wajib diisi",
                  minLength: {
                    value: 10,
                    message: "Keterangan minimal harus 10 karakter",
                  },
                })}
                placeholder="Jelaskan keperluan surat (minimal 10 karakter)"
                disabled={isLoading || cooldownTime > 0}
              />
              {errors.keterangan && (
                <p className="text-sm text-red-500">
                  {errors.keterangan.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                type="file"
                accept=".doc,.docx"
                {...register("file", { required: "File surat wajib diupload" })}
                disabled={isLoading || cooldownTime > 0}
              />
              {errors.file && (
                <p className="text-sm text-red-500">{errors.file.message}</p>
              )}
              <p className="text-sm text-gray-500">
                Format yang diterima: .doc, .docx (Max. 5MB)
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || cooldownTime > 0}
            >
              {cooldownTime > 0
                ? `Tunggu ${Math.ceil(cooldownTime / 1000)} detik`
                : isLoading
                ? "Mengirim..."
                : "Kirim Surat"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <SuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />

      <ErrorDialog
        isOpen={errorState.show}
        onClose={() => setErrorState({ show: false, message: "" })}
        message={errorState.message}
        remainingTime={cooldownTime}
      />
    </>
  );
}
