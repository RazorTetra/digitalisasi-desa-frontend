// src/app/(auth)/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication | Desa Tandengan Digital",
  description: "Authentication pages for Desa Tandengan Digital",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      {children}
    </main>
  );
}