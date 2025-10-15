import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

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
      pathname.startsWith('/api/public') ||
      pathname.startsWith('/debug') ||
      pathname.startsWith('/news-events') ||
      pathname.startsWith('/programas') ||
      pathname.startsWith('/proyectos') ||
      pathname.startsWith('/metodologias') ||
      pathname.startsWith('/news') ||
      pathname.startsWith('/historias-impacto') ||
      pathname.startsWith('/transparencia') ||
      pathname.startsWith('/recursos') ||
      pathname.startsWith('/aliados')) {
    return NextResponse.next()
  }

  // Proteger rutas del dashboard
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      // Redirigir al login si no hay sesión
      const loginUrl = new URL('/sign-in', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
    
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