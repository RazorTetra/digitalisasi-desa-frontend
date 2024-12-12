// src/app/(main)/kirim-surat/_components/success-dialog.tsx
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2 } from "lucide-react";

interface SuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SuccessDialog({ isOpen, onClose }: SuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            Surat Berhasil Dikirim
          </DialogTitle>
          <DialogDescription className="text-center">
            Terima kasih sudah memasukkan surat. Proses akan segera dilakukan. 
            Admin akan menghubungi melalui nomor WhatsApp ketika proses sudah selesai.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}