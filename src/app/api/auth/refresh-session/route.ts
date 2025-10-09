import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/auth/refresh-session - Refrescar la sesión JWT con datos actualizados
 */
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Refrescando sesión JWT...')

    // Obtener token de autenticación
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })

    if (!token?.id) {
      console.log('❌ No hay token de autenticación')
      return NextResponse.json(
        { message: 'Usuario no autenticado' },
        { status: 401 }
      )
    }

    // Obtener datos actualizados del usuario
    const user = await prisma.user.findUnique({
      where: { id: token.id as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        mustChangePassword: true,
        isActive: true
      }
    })

    if (!user) {
      console.log('❌ Usuario no encontrado')
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Datos actualizados del usuario:')
    console.log('   ID:', user.id)
    console.log('   Email:', user.email)
    console.log('   mustChangePassword:', user.mustChangePassword)

    // Devolver los datos actualizados
    return NextResponse.json({
      message: 'Sesión refrescada exitosamente',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
        isActive: user.isActive
      }
    })

  } catch (error) {
    console.error('❌ Error refrescando sesión:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
