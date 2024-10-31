// src/api/heroBannerApi.ts
import { apiClient } from "./apiClient";

export interface HeroBanner {
  id: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getHeroBanner = async (): Promise<HeroBanner> => {
  // Menggunakan fetch untuk memanfaatkan Next.js cache
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/hero-banner`,
      {
        next: {
          revalidate: 3600, // Cache selama 1 jam
        },
        // Menyertakan credentials dan headers yang sama dengan apiClient
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch hero banner");
    }

    return response.json();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Fallback ke axios client jika fetch gagal
    return apiClient
      .get<HeroBanner>("/hero-banner")
      .then((response) => response.data);
  }
};

// Update tetap menggunakan axios karena ada upload file
export const updateHeroBanner = (image: File): Promise<HeroBanner> => {
  const formData = new FormData();
  formData.append("image", image);

  return apiClient
    .put<HeroBanner>("/hero-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};
