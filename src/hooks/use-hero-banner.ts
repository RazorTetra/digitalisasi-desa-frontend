// src/hooks/use-hero-banner.ts
import { useQuery } from '@tanstack/react-query'
import { getHeroBanner, type HeroBanner } from '@/api/heroBannerApi'

export function useHeroBanner() {
  return useQuery<HeroBanner>({
    queryKey: ['heroBanner'],
    queryFn: getHeroBanner,
    staleTime: 1000 * 60 * 60, // 1 jam - sesuaikan dengan revalidate di API
    gcTime: 1000 * 60 * 60 * 2, // 2 jam
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}