// src/app/(main)/tamu-wajib-lapor/page.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  SearchX,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  TamuWajibLapor,
  submitLaporan,
  checkStatus,
} from "@/api/tamuWajibLaporApi";

interface StatusError {
  show: boolean;
  message: string;
}

const formSchema = z.object({
  nama: z.string().min(2, "Nama harus diisi minimal 2 karakter"),
  nik: z.string().length(16, "NIK harus terdiri dari 16 digit"),
  alamatAsal: z.string().min(5, "Alamat asal harus diisi minimal 5 karakter"),
  tujuan: z.string().min(2, "Tujuan kunjungan harus diisi"),
  lamaMenginap: z.enum(["1-3", "4-7", "8-14", "15+"] as const),
  tempatMenginap: z
    .string()
    .min(5, "Tempat menginap harus diisi minimal 5 karakter"),
  nomorTelepon: z
    .string()
    .min(10, "Nomor telepon harus diisi minimal 10 digit"),
});

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
} as const;

type FormValues = z.infer<typeof formSchema>;
type CheckResult = TamuWajibLapor | null;

const TamuWajibLaporPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const [checkResult, setCheckResult] = useState<CheckResult>(null);
  const [successDialog, setSuccessDialog] = useState(false);
  const [submittedCode, setSubmittedCode] = useState("");
  const { toast } = useToast();
  const [canCheck, setCanCheck] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [statusError, setStatusError] = useState<StatusError>({
    show: false,
    message: "",
  });
  const timerRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      nik: "",
      alamatAsal: "",
      tujuan: "",
      lamaMenginap: "1-3",
      tempatMenginap: "",
      nomorTelepon: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const response = await submitLaporan(values);
      setSubmittedCode(response.trackingCode);
      setSuccessDialog(true);
      form.reset();
      toast({
        title: "Berhasil",
        description: "Laporan tamu berhasil dikirim",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Gagal mengirim laporan";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearTimeout(countdownRef.current);
      }
    };
  }, []);

  const startCountdown = useCallback(() => {
    setCanCheck(false);
    setCountdown(5);

    const updateCountdown = () => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanCheck(true);
          return 0;
        }
        // Schedule next update
        countdownRef.current = setTimeout(updateCountdown, 1000);
        return prev - 1;
      });
    };

    // Start countdown
    countdownRef.current = setTimeout(updateCountdown, 1000);
  }, []);

  const handleStatusCheck = async () => {
    if (!trackingCode) {
      toast({
        title: "Error",
        description: "Masukkan kode tracking",
        variant: "destructive",
      });
      return;
    }

    if (!canCheck) {
      toast({
        title: "Mohon tunggu",
        description: `Anda dapat mencoba lagi dalam ${countdown} detik`,
      });
      return;
    }

    setIsCheckingStatus(true);
    setStatusError({ show: false, message: "" });

    try {
      const result = await checkStatus(trackingCode);
      setCheckResult(result);
      // Start countdown after successful check
      startCountdown();
    } catch (err) {
      setCheckResult(null);
      // Check if error is a 404 (not found) error
      if (err instanceof Error && err.message.includes("404")) {
        setStatusError({
          show: true,
          message:
            "Kode tracking tidak ditemukan. Pastikan kode yang Anda masukkan benar.",
        });
      } else {
        const errorMessage =
          err instanceof Error ? err.message : "Gagal memeriksa status";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      // Still start countdown even on error to prevent spam
      startCountdown();
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Update the status check section in the render
  const renderStatusCheck = () => (
    <Card>
      <CardHeader>
        <CardTitle>Cek Status Laporan</CardTitle>
        <CardDescription>
          Masukkan kode tracking untuk memeriksa status laporan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Masukkan kode tracking"
                value={trackingCode}
                onChange={(e) => {
                  setTrackingCode(e.target.value);
                  setStatusError({ show: false, message: "" });
                }}
                className={statusError.show ? "border-red-500" : ""}
              />
              {statusError.show && (
                <p className="text-sm text-red-500 mt-1">
                  {statusError.message}
                </p>
              )}
            </div>
            <Button
              onClick={handleStatusCheck}
              disabled={isCheckingStatus || !canCheck}
            >
              {isCheckingStatus ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : !canCheck ? (
                <span>{countdown}s</span>
              ) : (
                "Cek Status"
              )}
            </Button>
          </div>

          {/* Status Result */}
          {checkResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-background rounded-lg border"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">Status:</p>
                <Badge
                  variant="outline"
                  className={statusColors[checkResult.status]}
                >
                  {checkResult.status}
                </Badge>
              </div>
              {checkResult.statusMessage && (
                <p className="text-sm text-muted-foreground mt-2">
                  {checkResult.statusMessage}
                </p>
              )}
              <div className="text-sm text-muted-foreground mt-2">
                <Clock className="inline-block mr-2 h-4 w-4" />
                Diperbarui:{" "}
                {new Date(checkResult.updatedAt).toLocaleString("id-ID")}
              </div>
            </motion.div>
          )}

          {/* Not Found State */}
          {statusError.show && !checkResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 rounded-lg border border-red-100 flex items-center gap-3"
            >
              <SearchX className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-red-600 font-medium">
                  Laporan Tidak Ditemukan
                </p>
                <p className="text-sm text-red-500">
                  Periksa kembali kode tracking Anda atau hubungi petugas jika
                  Anda yakin kode sudah benar.
                </p>
              </div>
            </motion.div>
          )}

          {/* Helpful Information */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Untuk menghindari spam, ada jeda 5 detik antara setiap pengecekan
              status.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );

  // Static Code
  // text dan tulisan di form atau di halaman diubah dibagian ini
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">
          Tamu Wajib Lapor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Penting</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pelaporan Wajib</AlertTitle>
                <AlertDescription>
                  Setiap tamu yang menginap di Desa Tandengan wajib melaporkan
                  diri dalam waktu 1x24 jam.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prosedur Pelaporan</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Isi formulir dengan lengkap dan benar</li>
                <li>Pastikan nomor telepon yang diisi aktif</li>
                <li>Simpan kode tracking yang diberikan</li>
                <li>Tunggu verifikasi dari petugas</li>
                <li>Cek status laporan secara berkala</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontak Darurat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-2">
                Jika ada pertanyaan atau keadaan darurat, hubungi:
              </p>
              <p className="font-semibold">Kantor Desa Tandengan</p>
              <p>Telp: (0123) 456-7890</p>
              <p>Email: info@desatandengan.go.id</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="form" className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Form Laporan</TabsTrigger>
            <TabsTrigger value="check">Cek Status</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>Formulir Tamu Wajib Lapor</CardTitle>
                <CardDescription>
                  Isi data diri Anda dengan lengkap dan benar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="nama"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama lengkap"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nik"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIK</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan 16 digit NIK"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Nomor Induk Kependudukan (16 digit)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="alamatAsal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alamat Asal</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Masukkan alamat asal"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tujuan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tujuan Kunjungan</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan tujuan kunjungan"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lamaMenginap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lama Menginap</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih lama menginap" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-3">1-3 hari</SelectItem>
                              <SelectItem value="4-7">4-7 hari</SelectItem>
                              <SelectItem value="8-14">8-14 hari</SelectItem>
                              <SelectItem value="15+">
                                Lebih dari 14 hari
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tempatMenginap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tempat Menginap</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan alamat tempat menginap"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nomorTelepon"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Telepon</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nomor telepon"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        "Kirim Laporan"
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="check">
            {renderStatusCheck()}


          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Pertanyaan Umum</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Siapa yang wajib lapor?</AccordionTrigger>
                <AccordionContent>
                  Setiap tamu yang menginap di Desa Tandengan, baik di
                  penginapan umum maupun di rumah penduduk, wajib melaporkan
                  diri dalam waktu 1x24 jam setelah kedatangan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Apa konsekuensi jika tidak melapor?
                </AccordionTrigger>
                <AccordionContent>
                  Tamu yang tidak melapor dapat dikenakan sanksi administratif
                  sesuai dengan peraturan desa yang berlaku. Hal ini untuk
                  memastikan keamanan dan ketertiban bersama.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Bagaimana jika ada perubahan rencana menginap?
                </AccordionTrigger>
                <AccordionContent>
                  Jika ada perubahan rencana, seperti perpanjangan atau
                  pengurangan waktu menginap, harap segera melaporkan perubahan
                  tersebut ke kantor desa. Anda dapat menghubungi nomor kontak
                  yang tertera.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Berapa lama proses verifikasi laporan?
                </AccordionTrigger>
                <AccordionContent>
                  Proses verifikasi laporan biasanya memakan waktu 1-3 jam pada
                  jam kerja. Untuk kasus darurat atau mendesak, Anda dapat
                  menghubungi kontak darurat yang tersedia.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Apa yang harus disiapkan saat pelaporan?
                </AccordionTrigger>
                <AccordionContent>
                  Pastikan Anda memiliki dokumen berikut:
                  <ul className="list-disc list-inside mt-2">
                    <li>Kartu Identitas (KTP/Paspor)</li>
                    <li>Nomor telepon aktif</li>
                    <li>Alamat tempat menginap yang lengkap</li>
                    <li>Informasi tujuan dan durasi kunjungan</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={successDialog} onOpenChange={setSuccessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Laporan Berhasil Terkirim</DialogTitle>
              <DialogDescription>Kode tracking Anda:</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{submittedCode}</p>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Simpan kode tracking ini untuk memeriksa status laporan Anda.
                </AlertDescription>
              </Alert>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setSuccessDialog(false)}
                className="w-full"
              >
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default TamuWajibLaporPage;
