// src/app/(admin)/template.tsx
export default function AdminTemplate({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="flex h-screen">
        {/* Sidebar bisa ditambahkan di sini */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    );
  }