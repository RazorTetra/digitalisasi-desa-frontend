// src/config/query-client.ts
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data dianggap stale setelah 5 menit
      gcTime: 1000 * 60 * 30, // Garbage collection time (previously cacheTime)
      refetchOnWindowFocus: false, // Mencegah refetch otomatis saat window focus
    },
  },
})