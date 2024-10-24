// src/app/admin/keuangan/_components/FinanceItemForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const financeItemSchema = z.object({
  uraian: z.string().min(1, "Uraian harus diisi"),
  anggaran: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Anggaran harus lebih dari 0")
  ),
  realisasi: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Realisasi harus lebih dari 0")
  ),
});

type FormValues = z.infer<typeof financeItemSchema>;

type FinanceItemFormProps = {
  defaultValues?: {
    uraian: string;
    anggaran: number;
    realisasi: number;
  };
  onSubmit: (data: FormValues) => Promise<void>;
  isSubmitting: boolean;
};

export function FinanceItemForm({ 
  defaultValues, 
  onSubmit, 
  isSubmitting
}: FinanceItemFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(financeItemSchema),
    defaultValues: defaultValues || {
      uraian: "",
      anggaran: 0,
      realisasi: 0,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="uraian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uraian</FormLabel>
              <FormControl>
                <Input {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="anggaran"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Anggaran</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="realisasi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Realisasi</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan'
          )}
        </Button>
      </form>
    </Form>
  );
}