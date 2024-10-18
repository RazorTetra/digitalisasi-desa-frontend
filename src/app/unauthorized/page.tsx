// src/app/unauthorized/page.tsx
"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  const router = useRouter()

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.push('/login')
    }, 5000)

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Akses Ditolak</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <p>Anda akan diarahkan ke halaman login dalam 5 detik.</p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push('/login')} className="w-full">
            Pergi ke Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}