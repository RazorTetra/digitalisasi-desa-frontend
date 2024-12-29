// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/config/site";
import { seoConfig } from "@/config/seo";
import "./globals.css";
import { Providers } from "@/components/providers";
import { LoadingScreen } from "@/components/loading-screen";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Website Resmi Desa Tandengan | Desa Tandengan Digital",
    template: `%s | Desa Tandengan Digital`,
  },
  description: seoConfig.descriptions.home,
  keywords: seoConfig.getMetaKeywords(),
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.authorUrl,
    },
  ],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteConfig.url,
    title: "Website Resmi Desa Tandengan | Desa Tandengan Digital",
    description: seoConfig.descriptions.home,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Desa Tandengan Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Desa Tandengan Digital",
    description: seoConfig.descriptions.home,
    images: [siteConfig.ogImage],
    creator: "@desatandengan",
    site: "@desatandengan",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "LgKPILz_b6aoYtStROR5iQ_YZDQ6_DYm1tfqMDTdkEw",
  },
  category: "government",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seoConfig.organizationSchema),
          }}
        />
      </head>
      <body>
        <Providers>
          <LoadingScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
