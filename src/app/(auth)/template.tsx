// src/app/(auth)/template.tsx
export default function AuthTemplate({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        {children}
      </main>
    );
  }