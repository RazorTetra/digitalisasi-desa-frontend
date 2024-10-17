// src/components/layout/Navbar.tsx
"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Desa Tandengan Digital
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/layanan" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Layanan
              </Link>
              <Link href="/informasi" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Informasi
              </Link>
              <Link href="/tentang" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Tentang Kami
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ModeToggle />
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <ModeToggle />
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/layanan" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Layanan
            </Link>
            <Link href="/informasi" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Informasi
            </Link>
            <Link href="/tentang" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Tentang Kami
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;