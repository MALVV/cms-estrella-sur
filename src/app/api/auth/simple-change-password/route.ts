import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/security'

/**
 * POST /api/auth/simple-change-password - Cambio de contraseña simplificado
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Cambio de contraseña simplificado iniciado')

    // Obtener token de autenticación
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    console.log('🎫 Token obtenido:', token ? 'Sí' : 'No')
    console.log('   Token ID:', token?.id)
    console.log('   Token Email:', token?.email)

    if (!token?.id) {
      console.log('❌ No hay token de autenticación')
      return NextResponse.json(
        { message: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    const { newPassword } = await request.json()
    const userId = token.id

    console.log('   User ID:', userId)
    console.log('   New Password:', newPassword ? 'Proporcionada' : 'No proporcionada')

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

    // Crear respuesta con headers para invalidar la sesión
    const response = NextResponse.json({
      message: 'Contraseña cambiada exitosamente',
      user: updatedUser
    })

    // Invalidar la sesión JWT actual
    response.headers.set('Set-Cookie', 'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax')
    response.headers.set('Set-Cookie', 'next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax')

    return response

  } catch (error) {
    console.error('❌ Error cambiando contraseña simplificada:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
