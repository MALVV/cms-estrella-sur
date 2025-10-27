import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/auth-middleware'
import { UserRole, ROLE_PERMISSIONS, getAllRoles, getRoleDescription } from '@/lib/roles'

/**
 * GET /api/roles - Obtener información de roles y permisos
 */
export const GET = withRole(UserRole.ADMINISTRATOR)(async (request: NextRequest) => {
  try {
    const roles = getAllRoles().map(role => ({
      role,
      description: getRoleDescription(role),
      permissions: ROLE_PERMISSIONS.find(r => r.role === role)?.permissions || []
    }))

    return NextResponse.json({
      roles,
      hierarchy: [
        { role: UserRole.ADMINISTRATOR, level: 1, description: 'Máximo privilegio - Gestión completa' },
        { role: UserRole.MANAGER, level: 2, description: 'Gestión de contenido' }
      ]
    })

  } catch (error) {
    console.error('Error obteniendo roles:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
