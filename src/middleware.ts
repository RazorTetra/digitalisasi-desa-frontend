// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthPath = path === '/login' || path === '/register'
  const isAdminPath = path.startsWith('/admin')

  const token = request.cookies.get('accessToken')?.value || ''

  if (isAuthPath && token) {
    // If user is already logged in, redirect them based on their role
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          Cookie: `accessToken=${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
    } catch (error) {
      console.error('Error verifying user role:', error)
    }
  }

  if (!token && !isAuthPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (token && isAdminPath) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        headers: {
          Cookie: `accessToken=${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        if (userData.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
      } else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    } catch (error) {
      console.error('Error verifying user role:', error)
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/admin/:path*',
  ]
}