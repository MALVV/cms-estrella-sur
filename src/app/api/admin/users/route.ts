import { NextRequest, NextResponse } from 'next/server'
import { withRole } from '@/lib/auth-middleware'
import { UserRole } from '@/lib/roles'
import { registerUser } from '@/lib/auth-service'
import { generateTemporaryPassword } from '@/lib/temp-password'

/**
 * POST /api/admin/users - Crear nuevo usuario (solo administradores)
 */
export const POST = withRole(UserRole.ADMINISTRATOR)(async (request: NextRequest) => {
  try {
    const { email, name, role } = await request.json()

    // Validaciones básicas
    if (!email) {
      return NextResponse.json(
        { message: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Validar rol
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { message: 'Rol inválido' },
        { status: 400 }
      )
    }

    // Generar contraseña temporal
    const temporaryPassword = generateTemporaryPassword()

    // Crear usuario con contraseña temporal
    const result = await registerUser({
      email,
      password: temporaryPassword,
      name,
      role: role || UserRole.MANAGER,
      isTemporaryPassword: true,
      createdBy: (request as { user?: { id: string } }).user?.id // ID del administrador actual
    })

    if (!result.success) {
      return NextResponse.json(
        { message: result.message, errors: result.errors },
        { status: 400 }
      )
    }

    // Retornar información del usuario creado con contraseña temporal
    return NextResponse.json({
      message: 'Usuario creado exitosamente',
      user: result.user,
      temporaryCredentials: {
        email,
        password: temporaryPassword,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
      },
      instructions: 'El usuario debe cambiar su contraseña en el primer login'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creando usuario:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
