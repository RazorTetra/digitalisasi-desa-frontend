// src/hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, UserData } from '@/api/userApi'

export function useAuth(requireAdmin: boolean = false) {
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        setUser(userData)
        if (requireAdmin && userData.role !== 'ADMIN') {
          router.push('/unauthorized')
        }
      } catch (error) {
        console.error('Failed to load user:', error)
        if (requireAdmin) {
          router.push('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router, requireAdmin])

  return { user, loading }
}