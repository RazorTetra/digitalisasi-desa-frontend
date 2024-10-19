// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from './api/authApi'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthPath = path === '/login' || path === '/register'
  const isAdminPath = path.startsWith('/admin')

  const userDataString = request.cookies.get('userData')?.value

  if (isAuthPath && userDataString) {
    // If user is already logged in, redirect them based on their role
    try {
      const userData: User = JSON.parse(userDataString)
      if (userData.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      } else {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
    }
  }

  if (!userDataString && !isAuthPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (userDataString && isAdminPath) {
    try {
      const userData: User = JSON.parse(userDataString)
      if (userData.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
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