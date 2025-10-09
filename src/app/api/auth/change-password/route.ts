import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth-middleware'
import { changePassword } from '@/lib/auth-service'

/**
 * POST /api/auth/change-password - Cambiar contraseña del usuario autenticado
 */
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const { currentPassword, newPassword } = await request.json()
    const userId = (request as any).user?.id

    if (!userId) {
      return NextResponse.json(
        { message: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Validaciones básicas
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Contraseña actual y nueva contraseña son requeridas' },
        { status: 400 }
      )
    }

    // Cambiar contraseña
    const result = await changePassword(userId, currentPassword, newPassword)

    if (!result.success) {
      return NextResponse.json(
        { message: result.message, errors: result.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: result.message
    })

  } catch (error) {
    console.error('Error cambiando contraseña:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
