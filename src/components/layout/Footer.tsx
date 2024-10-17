// src/components/layout/Footer.tsx
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
            <p className="text-sm text-muted-foreground">
              Website digitalisasi Desa Tandengan untuk memudahkan pelayanan dan akses informasi bagi masyarakat.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li><Link href="/layanan" className="text-sm hover:text-primary">Layanan</Link></li>
              <li><Link href="/informasi" className="text-sm hover:text-primary">Informasi</Link></li>
              <li><Link href="/tentang" className="text-sm hover:text-primary">Tentang Kami</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <p className="text-sm">Alamat: Jl. Desa Tandengan No. 123</p>
            <p className="text-sm">Email: info@desatandengan.go.id</p>
            <p className="text-sm">Telp: (0123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Desa Tandengan Digital. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  );
};

export default Footer;