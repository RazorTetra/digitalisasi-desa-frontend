// src/lib/whatsapp-utils.ts
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Submission } from '@/api/submissionApi';

export const formatWhatsAppNumber = (number: string): string => {
  return number.startsWith('0') 
    ? `62${number.slice(1)}` 
    : number;
};

export const getSubmissionWhatsAppUrl = (submission: Submission): string => {
  const whatsappNumber = formatWhatsAppNumber(submission.whatsapp);
  const tanggal = format(new Date(submission.createdAt), 'dd MMMM yyyy', { locale: id });
  
  const message = `Halo Bpk/Ibu ${submission.pengirim}, surat ${submission.kategori} yang dimasukkan tanggal ${tanggal} telah selesai diproses, silahkan datang ke kantor desa untuk proses lebih lanjut.`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
};