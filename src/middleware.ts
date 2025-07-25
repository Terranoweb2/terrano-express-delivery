import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protéger les routes admin (sauf login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    const user = await verifyAdminToken(token)
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Ajouter les infos utilisateur à la requête
    const response = NextResponse.next()
    response.headers.set('x-admin-user', JSON.stringify(user))
    return response
  }

  // Rediriger vers le dashboard si déjà connecté et tentative d'accès à login
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin-token')?.value

    if (token) {
      const user = await verifyAdminToken(token)
      if (user) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
