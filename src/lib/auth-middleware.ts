import { NextRequest, NextResponse } from 'next/server'
import { verifyAccessToken } from './security'
import { getUserById } from './auth-service'
import { UserRole, hasEqualOrHigherPrivilege, canPerformAction } from './roles'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
    name?: string
    role: UserRole
  }
}

/**
 * Middleware para verificar autenticación JWT
 */
export async function verifyAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean
  user?: any
  error?: string
}> {
  try {
    // Obtener token del header Authorization
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isAuthenticated: false,
        error: 'Token de autorización no encontrado'
      }
    }

    const token = authHeader.substring(7) // Remover 'Bearer '

    // Verificar token
    const decoded = verifyAccessToken(token)

    // Obtener información actualizada del usuario
    const user = await getUserById((decoded as any).id)
    
    if (!user) {
      return {
        isAuthenticated: false,
        error: 'Usuario no encontrado'
      }
    }

    return {
      isAuthenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role as UserRole
      }
    }

  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return {
      isAuthenticated: false,
      error: 'Token inválido o expirado'
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
 * Middleware para verificar roles específicos
 */
export function withRole(requiredRole: UserRole) {
  return function(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (request: AuthenticatedRequest) => {
      if (!request.user) {
        return NextResponse.json(
          { message: 'Usuario no autenticado' },
          { status: 401 }
        )
      }

      if (!hasEqualOrHigherPrivilege(request.user.role, requiredRole)) {
        return NextResponse.json(
          { 
            message: 'Permisos insuficientes',
            error: `Se requiere rol ${requiredRole} o superior`
          },
          { status: 403 }
        )
      }

      return handler(request)
    })
  }
}

/**
 * Middleware para verificar permisos específicos
 */
export function withPermission(resource: string, action: string) {
  return function(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (request: AuthenticatedRequest) => {
      if (!request.user) {
        return NextResponse.json(
          { message: 'Usuario no autenticado' },
          { status: 401 }
        )
      }

      if (!canPerformAction(request.user.role, resource, action)) {
        return NextResponse.json(
          { 
            message: 'Permisos insuficientes',
            error: `No tiene permisos para ${action} en ${resource}`
          },
          { status: 403 }
        )
      }

      return handler(request)
    })
  }
}

/**
 * Middleware para verificar múltiples roles (OR)
 */
export function withAnyRole(roles: UserRole[]) {
  return function(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
    return withAuth(async (request: AuthenticatedRequest) => {
      if (!request.user) {
        return NextResponse.json(
          { message: 'Usuario no autenticado' },
          { status: 401 }
        )
      }

      if (!roles.includes(request.user.role)) {
        return NextResponse.json(
          { 
            message: 'Permisos insuficientes',
            error: `Se requiere uno de los siguientes roles: ${roles.join(', ')}`
          },
          { status: 403 }
        )
      }

      return handler(request)
    })
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