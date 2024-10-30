// src/app/(admin)/keuangan/page.tsx
import { Suspense } from 'react';
import { PeriodList } from './_components/period-list';
import { CreatePeriodButton } from './_components/create-period-button';

export const metadata = {
  title: 'Manajemen Keuangan - Admin Panel',
};

export default function KeuanganPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Keuangan
          </h1>
          <p className="text-muted-foreground">
            Kelola data keuangan desa per periode
          </p>
        </div>
        <CreatePeriodButton />
      </div>

      <Suspense 
        fallback={
          <div className="flex items-center justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        }
      >
        <PeriodList />
      </Suspense>
    </div>
  );
}