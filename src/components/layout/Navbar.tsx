// src/components/layout/Navbar.tsx
"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/theme-toggle';
import { Menu, User } from 'lucide-react';
import { logout } from '@/api/authApi';
import { getCurrentUser, UserData } from '@/api/userApi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
              <Link href="/pengumuman" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Pengumuman
              </Link>
              <Link href="/informasi-desa" className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                Tentang Kami
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <ModeToggle />
              {user ? (
                <>
                  <span className="text-sm font-medium mx-4">Halo, {user.namaDepan}</span>
                  <Link href={`/${user.id}/profil`}>
                    <Button 
                      variant="ghost"
                      className="mr-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleLogout} 
                    variant="outline"
                    className="hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button 
                      variant="ghost" 
                      className="ml-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button 
                      variant="outline" 
                      className="ml-2 hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                    >
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
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
            <Link href="/pengumuman" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Pengumuman
            </Link>
            <Link href="/informasi-desa" className="text-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium">
              Tentang Kami
            </Link>
            {user ? (
              <>
                <span className="block px-3 py-2 text-sm font-medium">Halo, {user.namaDepan}</span>
                <Link href={`/${user.id}/profil`} className="block w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </Button>
                </Link>
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  className="w-full text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="block w-full">
                  <Button 
                    variant="ghost" 
                    className="w-full text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="block w-full">
                  <Button 
                    variant="outline" 
                    className="w-full text-left justify-start hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;