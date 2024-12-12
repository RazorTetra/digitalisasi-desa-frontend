// src/app/(main)/kirim-surat/_components/error-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

interface ErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  remainingTime?: number;
}

export function ErrorDialog({
  isOpen,
  onClose,
  message,
  remainingTime,
}: ErrorDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-lg font-semibold">
            Gagal Mengirim Surat
          </DialogTitle>
          <DialogDescription className="text-center space-y-2">
            <p className="text-base">{message}</p>
            {remainingTime !== undefined && remainingTime > 0 && (
              <p className="text-sm text-muted-foreground">
                Silakan tunggu {Math.ceil(remainingTime / 1000)} detik sebelum
                mencoba kembali
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
