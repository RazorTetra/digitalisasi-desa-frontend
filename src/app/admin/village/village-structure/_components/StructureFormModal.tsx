// src/app/admin/village/village-structure/_components/StructureFormModal.tsx
import { useCallback } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Button } from "@/components/ui/button";
import { VillageStructure } from "@/api/villageApi";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  position: z.string().min(1, "Jabatan harus diisi"),
  name: z.string().min(2, "Nama harus diisi minimal 2 karakter"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Pick<VillageStructure, "position" | "name">) => Promise<void>;
  isSubmitting: boolean;
  editData?: VillageStructure;
}

export function StructureFormModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  isSubmitting, 
  editData 
}: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      position: editData?.position || "",
      name: editData?.name || "",
    },
  });

  const handleSubmit = useCallback(async (data: z.infer<typeof formSchema>) => {
    await onSubmit({
      position: data.position.trim(),
      name: data.name.trim(),
    });
  }, [onSubmit]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Struktur" : "Tambah Struktur"}
          </DialogTitle>
          <DialogDescription>
            {editData ? "Edit data struktur organisasi desa" : "Tambah data struktur organisasi baru"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jabatan</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan nama jabatan" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Masukkan nama pejabat" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}