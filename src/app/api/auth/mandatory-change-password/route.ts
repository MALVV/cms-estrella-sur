import { NextRequest, NextResponse } from 'next/server'
import { withSimpleAuth } from '@/lib/simple-auth-middleware'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/security'

/**
 * POST /api/auth/mandatory-change-password - Cambio de contraseña obligatorio (sin contraseña actual)
 */
export const POST = withSimpleAuth(async (request: NextRequest) => {
  try {
    const { newPassword } = await request.json()
    const userId = (request as any).user?.id

    console.log('🔐 Cambio de contraseña obligatorio iniciado')
    console.log('   User ID:', userId)
    console.log('   User Email:', (request as any).user?.email)

    if (!userId) {
      console.log('❌ No hay userId en la request')
      return NextResponse.json(
        { message: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Validaciones básicas
    if (!newPassword) {
      return NextResponse.json(
        { message: 'Nueva contraseña es requerida' },
        { status: 400 }
      )
    }

    // Validar fortaleza de contraseña
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    if (!/[A-Z]/.test(newPassword)) {
      return NextResponse.json(
        { message: 'La contraseña debe contener al menos una letra mayúscula' },
        { status: 400 }
      )
    }

    if (!/[a-z]/.test(newPassword)) {
      return NextResponse.json(
        { message: 'La contraseña debe contener al menos una letra minúscula' },
        { status: 400 }
      )
    }

    if (!/[0-9]/.test(newPassword)) {
      return NextResponse.json(
        { message: 'La contraseña debe contener al menos un número' },
        { status: 400 }
      )
    }

    if (!/[^A-Za-z0-9]/.test(newPassword)) {
      return NextResponse.json(
        { message: 'La contraseña debe contener al menos un carácter especial' },
        { status: 400 }
      )
    }

    // Hashear nueva contraseña
    const hashedPassword = await hashPassword(newPassword)

    // Actualizar contraseña y resetear mustChangePassword
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        mustChangePassword: true,
        updatedAt: true
      }
    })

    console.log('✅ Contraseña cambiada exitosamente:')
    console.log('   User ID:', updatedUser.id)
    console.log('   Email:', updatedUser.email)
    console.log('   mustChangePassword:', updatedUser.mustChangePassword)
    console.log('   Updated At:', updatedUser.updatedAt)

    return NextResponse.json({
      message: 'Contraseña cambiada exitosamente'
    })

  } catch (error) {
    console.error('Error cambiando contraseña obligatoria:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
})
