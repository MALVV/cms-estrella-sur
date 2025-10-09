import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name?: string
    role: string
  }
}

/**
 * Middleware para verificar autenticación con NextAuth.js
 */
export async function verifyAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean
  user?: any
  error?: string
}> {
  try {
    // Obtener sesión usando NextAuth.js
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return {
        isAuthenticated: false,
        error: 'Sesión no encontrada'
      }
    }

    return {
      isAuthenticated: true,
      user: {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role || 'TECNICO'
      }
    }

  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return {
      isAuthenticated: false,
      error: 'Error de autenticación'
    }
  }
}

/**
 * Middleware para rutas protegidas
 */
export function withAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)

    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { 
          message: 'No autorizado',
          error: authResult.error 
        },
        { status: 401 }
      )
    }

    // Agregar usuario a la request
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = authResult.user

    return handler(authenticatedRequest)
  }
}

/**
 * Alias para withAuth (compatibilidad)
 */
export const withSimpleAuth = withAuth

/**
 * Middleware para rutas que requieren roles específicos
 */
export function withSimpleRole(
  allowedRoles: string[],
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await verifyAuth(request)

    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { 
          message: 'No autorizado',
          error: authResult.error 
        },
        { status: 401 }
      )
    }

    // Verificar rol
    if (!allowedRoles.includes(authResult.user?.role || '')) {
      return NextResponse.json(
        { 
          message: 'Permisos insuficientes',
          error: 'No tienes permisos para acceder a este recurso'
        },
        { status: 403 }
      )
    }

    // Agregar usuario a la request
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = authResult.user

    return handler(authenticatedRequest)
  }
}

/**
 * Headers de seguridad
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }
}

/**
 * Aplicar headers de seguridad a la respuesta
 */
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const securityHeaders = getSecurityHeaders()
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}