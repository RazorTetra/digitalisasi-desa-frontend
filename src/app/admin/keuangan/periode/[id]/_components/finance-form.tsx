// src/app/(admin)/finance/periods/[id]/_components/finance-form.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  uraian: z.string().min(1, "Uraian harus diisi"),
  dana: z.number(),
  jenis: z.enum(["PENERIMAAN", "PENGELUARAN"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface FinanceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<boolean>;
  title: string;
  initialData?: {
    uraian: string;
    dana: number;
    jenis?: "PENERIMAAN" | "PENGELUARAN";
  } | null;
  onClose: () => void;
  showJenisField?: boolean;
}

export function FinanceForm({
  open,
  onOpenChange,
  onSubmit,
  title,
  initialData,
  onClose,
  showJenisField = false,
}: FinanceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uraian: "",
      dana: 0,
      jenis: "PENERIMAAN",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        uraian: initialData.uraian,
        dana: initialData.dana,
        jenis: initialData.jenis,
      });
    } else {
      form.reset({
        uraian: "",
        dana: 0,
        jenis: "PENERIMAAN",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: FormValues) => {
    const success = await onSubmit(values);
    if (success) {
      onClose();
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="uraian"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uraian</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dana"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dana</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showJenisField && (
              <FormField
                control={form.control}
                name="jenis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jenis</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENERIMAAN">Penerimaan</SelectItem>
                        <SelectItem value="PENGELUARAN">Pengeluaran</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
