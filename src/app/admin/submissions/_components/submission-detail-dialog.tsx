// src/app/admin/submissions/_components/submission-detail-dialog.tsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Submission,
  SubmissionStatus,
  updateSubmissionStatus,
} from "@/api/submissionApi";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, MessageCircle } from "lucide-react";
import { getSubmissionWhatsAppUrl } from "@/lib/whatsapp-utils";

interface SubmissionDetailDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (id: string, newStatus: SubmissionStatus) => void;
}

export function SubmissionDetailDialog({
  submission,
  open,
  onOpenChange,
  onStatusUpdate,
}: SubmissionDetailDialogProps) {
  const { toast } = useToast();
  const [status, setStatus] = useState<SubmissionStatus | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset status hanya ketika submission berubah
  useEffect(() => {
    if (submission) {
      setStatus(submission.status);
    }
  }, [submission]);

  const handleStatusUpdate = async () => {
    if (!submission || !status) return;

    setIsUpdating(true);
    try {
      await updateSubmissionStatus(submission.id, { status });
      onStatusUpdate(submission.id, status);
      toast({
        description: "Status berhasil diperbarui",
      });
      onOpenChange(false); // Tutup dialog setelah berhasil
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Gagal memperbarui status",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Gagal memperbarui status",
          description: "Terjadi kesalahan saat memperbarui status",
          variant: "destructive",
        });
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detail Pengajuan Surat</DialogTitle>
          <DialogDescription>
            Detail lengkap pengajuan surat dari warga
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Pengirim</span>
            <span className="col-span-3">{submission.pengirim}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">WhatsApp</span>
            <span className="col-span-3">{submission.whatsapp}</span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Kategori</span>
            <span className="col-span-3">{submission.kategori}</span>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <span className="font-medium">Keterangan</span>
            <span className="col-span-3 whitespace-pre-wrap">
              {submission.keterangan}
            </span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">File</span>
            <div className="col-span-3 flex items-center gap-2">
              <span>{submission.fileName}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => window.open(submission.fileUrl, "_blank")}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Tanggal Dibuat</span>
            <span className="col-span-3">
              {format(new Date(submission.createdAt), "dd MMMM yyyy HH:mm", {
                locale: id,
              })}
            </span>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-medium">Status</span>
            <div className="col-span-3">
              <Select
                value={status}
                onValueChange={(value: SubmissionStatus) => {
                  console.log("Status changed to:", value);
                  setStatus(value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DIPROSES">DIPROSES</SelectItem>
                  <SelectItem value="SELESAI">SELESAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {submission.status === "SELESAI" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="font-medium">Hubungi</span>
              <div className="col-span-3">
                <Button
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  asChild
                >
                  <a
                    href={getSubmissionWhatsAppUrl(submission)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Hubungi via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">
            Tutup
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isUpdating || status === submission.status}
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Memperbarui...
              </>
            ) : (
              "Perbarui Status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
