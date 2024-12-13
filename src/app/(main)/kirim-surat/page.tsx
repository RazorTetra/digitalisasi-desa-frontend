// src/app/(main)/kirim-surat/page.tsx
import { Metadata } from "next";
import { SubmissionForm } from "./_components/submission-form";

export const metadata: Metadata = {
  title: "Kirim Surat",
  description: "Kirim surat dan dokumen untuk diproses oleh admin desa",
};

export default function KirimSuratPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Kirim Surat</h1>
          <p className="text-gray-600 mt-2">
            Silakan isi formulir berikut untuk mengirim surat atau dokumen yang
            akan diproses
          </p>
          <p className="text-gray-600">
            Unduh format surat dihalaman berikut{" "}
            <a href="../surat" className="text-blue-500 underline">
              format surat
            </a>
          </p>
        </div>

        <SubmissionForm />

        <div className="text-sm text-gray-500 text-center">
          <p>
            Setelah mengirim, Anda akan mendapatkan notifikasi melalui WhatsApp
          </p>
          <p>ketika dokumen Anda telah selesai diproses.</p>
        </div>
      </div>
    </div>
  );
}
