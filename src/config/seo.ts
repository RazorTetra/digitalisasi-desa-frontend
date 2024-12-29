// src/config/seo.ts

export const seoConfig = {
  // Kata kunci utama
  mainKeywords: [
    "Desa Tandengan",
    "Tandengan",
    "Website Desa Tandengan",
    "Kantor Desa Tandengan",
    "Desa Tandengan Minahasa",
    "Desa Tandengan Sulawesi Utara",
  ],

  // Lokasi dan wilayah administratif
  locationKeywords: [
    "Tandengan",
    "Desa Tandengan",
    "Kecamatan Eris",
    "Kabupaten Minahasa",
    "Sulawesi Utara",
    "Tondano",
    "SULUT",
  ],

  // Layanan desa
  serviceKeywords: [
    "Layanan Desa Tandengan",
    "Surat Online Desa Tandengan",
    "Pelayanan Publik Desa Tandengan",
    "Administrasi Desa Tandengan",
    "Kantor Desa Tandengan",
    "Pelayanan Surat Desa Tandengan",
    "Surat Pengantar Desa Tandengan",
    "Surat Keterangan Desa Tandengan",
  ],

  // Pemerintahan dan aparat
  governmentKeywords: [
    "Pemerintah Desa Tandengan",
    "Kepala Desa Tandengan",
    "Perangkat Desa Tandengan",
    "Struktur Desa Tandengan",
    "BPD Desa Tandengan",
    "Aparat Desa Tandengan",
  ],

  // Program dan kegiatan
  programKeywords: [
    "Program Desa Tandengan",
    "Kegiatan Desa Tandengan",
    "Pembangunan Desa Tandengan",
    "Dana Desa Tandengan",
    "Anggaran Desa Tandengan",
    "Transparansi Desa Tandengan",
  ],

  // Potensi dan pariwisata
  tourismKeywords: [
    "Wisata Desa Tandengan",
    "Pariwisata Tandengan",
    "Potensi Desa Tandengan",
    "Budaya Desa Tandengan",
    "Adat Istiadat Tandengan",
    "UMKM Desa Tandengan",
  ],

  // Variasi penulisan
  spellingVariations: [
    "Tandengan",
    "Desa Tandengan",
    "Tandengian",
    "Desa Tandengian",
    "Tandengan Minahasa",
    "Tandengan Sulut",
  ],

  // Kombinasi keyword untuk meta tags
  getMetaKeywords(): string[] {
    return [
      ...this.mainKeywords,
      ...this.locationKeywords,
      ...this.serviceKeywords.slice(0, 5),
      ...this.governmentKeywords.slice(0, 3),
      ...this.programKeywords.slice(0, 3),
      ...this.tourismKeywords.slice(0, 3),
      ...this.spellingVariations,
    ];
  },

  // Meta descriptions untuk berbagai halaman
  descriptions: {
    home: "Website Desa Tandengan - Portal layanan digital dan informasi masyarakat Desa Tandengan, Kecamatan Eris, Kabupaten Minahasa, Sulawesi Utara. Akses layanan surat online 24 jam.",
    about:
      "Informasi lengkap tentang profil dan sejarah Desa Tandengan, visi misi, struktur pemerintahan, dan potensi desa. Kenali lebih dekat Desa Tandengan Minahasa.",
    service:
      "Layanan online Desa Tandengan untuk pembuatan surat, administrasi, dan pelayanan publik. Proses cepat dan efisien untuk warga Desa Tandengan.",
    tourism:
      "Jelajahi keindahan dan potensi wisata Desa Tandengan. Temukan destinasi menarik, budaya lokal, dan UMKM di Desa Tandengan Minahasa.",
    finance:
      "Transparansi keuangan dan pengelolaan dana Desa Tandengan. Lihat laporan penggunaan anggaran dan pembangunan desa secara transparan.",
  },

  // Schema.org data
  organizationSchema: {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: "Pemerintah Desa Tandengan",
    alternateName: "Desa Tandengan",
    url: "https://tandengan.id",
    logo: "https://tandengan.id/logo.png",
    description:
      "Pemerintah Desa Tandengan - Kecamatan Eris, Kabupaten Minahasa, Sulawesi Utara",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Desa Tandengan",
      addressRegion: "Sulawesi Utara",
      addressCountry: "ID",
    },
    parentOrganization: {
      "@type": "GovernmentOrganization",
      name: "Pemerintah Kabupaten Minahasa",
    },
  },
};

// Helper function untuk mendapatkan meta tags
export const getMetaTags = (pageName: keyof typeof seoConfig.descriptions) => {
  return {
    title: `${
      pageName === "home"
        ? ""
        : pageName.charAt(0).toUpperCase() + pageName.slice(1) + " | "
    }Desa Tandengan Digital`,
    description: seoConfig.descriptions[pageName],
    keywords: seoConfig.getMetaKeywords().join(", "),
  };
};
