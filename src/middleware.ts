// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from './api/authApi'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isAuthPath = path === '/login' || path === '/register'
  const isAdminPath = path === '/dashboard' || path.startsWith('/village')|| path === '/users'

  // Ganti ini dengan nama cookie yang benar
  const userDataString = request.cookies.get('userData')?.value

  if (userDataString) {
    try {
      const userData: User = JSON.parse(userDataString)
      
      if (isAuthPath) {
        // Jika user sudah login dan mencoba mengakses halaman auth, redirect ke halaman yang sesuai
        if (userData.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        } else {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }

      if (isAdminPath && userData.role !== 'ADMIN') {
        // Jika user bukan admin dan mencoba mengakses halaman admin, redirect ke unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      // Jika ada error parsing, hapus cookie dan redirect ke login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('userData')
      return response
    }
  } else if (!isAuthPath) {
    // Jika tidak ada userData dan bukan di halaman auth, redirect ke login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}