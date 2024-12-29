// src/config/site.ts
const isProd = process.env.NODE_ENV === 'production';

// Base URL configuration
const MAIN_DOMAIN = 'https://tandengan.id';
const VERCEL_DOMAIN = 'https://desa-tandengan.vercel.app';
const DEV_DOMAIN = 'http://localhost:3160';

export const siteConfig = {
  name: "Desa Tandengan Digital",
  description: "Website Desa Tandengan untuk memudahkan pelayanan dan akses informasi bagi masyarakat.",
  // Gunakan domain sesuai environment
  url: isProd ? MAIN_DOMAIN : DEV_DOMAIN,
  // Simpan Vercel URL untuk backup
  vercelUrl: VERCEL_DOMAIN,
  // Asset URLs
  ogImage: isProd ? `${MAIN_DOMAIN}/og.jpg` : `${DEV_DOMAIN}/og.jpg`,
  author: "Alisia Timunghide",
  authorUrl: isProd ? MAIN_DOMAIN : DEV_DOMAIN,
  links: {
    facebook: "https://facebook.com/desatandengan",
    twitter: "https://twitter.com/desatandengan",
    instagram: "https://instagram.com/desatandengan",
  },
} as const;

// Helper function untuk mendapatkan canonical URL
export const getCanonicalUrl = (path: string = ''): string => {
  const baseUrl = siteConfig.url.endsWith('/') ? siteConfig.url.slice(0, -1) : siteConfig.url;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};