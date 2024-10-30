/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/(admin)/keuangan/_components/create-period-button.tsx
'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { createPeriod } from '@/api/financeApi';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { refreshPeriodList } from './period-list';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreatePeriodButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreate = async () => {
    if (!year) return;

    setIsLoading(true);
    try {
      await createPeriod({ tahun: year });
      setIsOpen(false);
      refreshPeriodList(); // Trigger refresh pada list
      toast({
        title: "Periode berhasil dibuat",
        description: `Periode tahun ${year} telah ditambahkan.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal membuat periode baru. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Tambah Periode
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Periode Baru</DialogTitle>
            <DialogDescription>
              Masukkan tahun untuk periode keuangan baru.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2000}
                max={9999}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              onClick={handleCreate}
              disabled={isLoading || !year}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}