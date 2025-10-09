import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir acceso a todas las rutas de NextAuth sin procesamiento
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  // Permitir acceso a rutas públicas
  if (pathname.startsWith('/sign-in') || 
      pathname.startsWith('/sign-up') ||
      pathname === '/' ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/debug') ||
      pathname.startsWith('/news-events')) {
    return NextResponse.next()
  }

  // Para rutas del dashboard, permitir acceso
  if (pathname.startsWith('/dashboard')) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}