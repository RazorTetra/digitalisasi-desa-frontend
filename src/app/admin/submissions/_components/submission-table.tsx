// src/app/admin/submissions/_components/submission-table.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Submission,
  SubmissionStatus,
  deleteSubmission,
} from "@/api/submissionApi";
import {
  FileDown,
  MoreHorizontal,
  Search,
  Trash2,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SubmissionDetailDialog } from "./submission-detail-dialog";
import { getSubmissionWhatsAppUrl } from "@/lib/whatsapp-utils";

interface SubmissionTableProps {
  submissions: Submission[];
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: SubmissionStatus) => void;
}

export function SubmissionTable({
  submissions,
  onDelete,
  onStatusUpdate,
}: SubmissionTableProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteSubmission(id);
      onDelete(id);
      toast({
        description: "Submission berhasil dihapus",
      });
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Gagal menghapus submission",
          variant: "destructive",
        });
      }
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: SubmissionStatus) => {
    switch (status) {
      case 'DIPROSES':
        return <Badge variant="secondary">DIPROSES</Badge>;
      case 'SELESAI':
        return <Badge variant="outline" className="bg-green-100 text-green-800">SELESAI</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Pengirim</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>File</TableHead>
            <TableHead className="w-[70px]">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                {format(new Date(submission.createdAt), "dd MMMM yyyy", {
                  locale: id,
                })}
              </TableCell>
              <TableCell>{submission.pengirim}</TableCell>
              <TableCell>{submission.whatsapp}</TableCell>
              <TableCell>{submission.kategori}</TableCell>
              <TableCell>{getStatusBadge(submission.status)}</TableCell>
              <TableCell>{submission.fileName}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSubmission(submission);
                        setDetailDialogOpen(true);
                      }}
                    >
                      <Search className="mr-2 h-4 w-4" />
                      Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownload(submission.fileUrl)}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      disabled={isDeleting === submission.id}
                      onClick={() => handleDelete(submission.id)}
                    >
                      {isDeleting === submission.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      {isDeleting === submission.id ? "Menghapus..." : "Hapus"}
                    </DropdownMenuItem>
                    {submission.status === "SELESAI" && (
                    <DropdownMenuItem asChild>
                      <a
                        href={getSubmissionWhatsAppUrl(submission)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Hubungi via WhatsApp
                      </a>
                    </DropdownMenuItem>
                  )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SubmissionDetailDialog
        submission={selectedSubmission}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onStatusUpdate={onStatusUpdate}
      />
    </>
  );
}
