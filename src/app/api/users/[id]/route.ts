import { NextRequest, NextResponse } from 'next/server'
import { withSimpleRole } from '@/lib/simple-auth-middleware'
import { UserRole } from '@/lib/roles'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword } from '@/lib/security'

/**
 * GET /api/users/[id] - Obtener usuario específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withSimpleRole([UserRole.ADMINISTRADOR], async (authenticatedRequest) => {
    try {
      const resolvedParams = await params;
      const userId = resolvedParams.id

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        lastLoginAt: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })

    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      return NextResponse.json(
        { message: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  })(request)
}

/**
 * PUT /api/users/[id] - Actualizar usuario
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withSimpleRole([UserRole.ADMINISTRADOR], async (authenticatedRequest) => {
    try {
      const resolvedParams = await params;
      const userId = resolvedParams.id
    const { name, email, role, isActive } = await authenticatedRequest.json()

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // No permitir modificar al usuario actual
    const currentUserId = authenticatedRequest.user?.id
    if (userId === currentUserId) {
      return NextResponse.json(
        { message: 'No puedes modificar tu propia cuenta desde aquí' },
        { status: 400 }
      )
    }

    // Validar rol si se proporciona
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { message: 'Rol inválido' },
        { status: 400 }
      )
    }

    // Verificar email único si se cambia
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json(
          { message: 'Ya existe un usuario con este email' },
          { status: 400 }
        )
      }
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(typeof isActive === 'boolean' && { isActive })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        lastLoginAt: true,
        isActive: true,
        mustChangePassword: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Usuario actualizado exitosamente',
      user: updatedUser
    })

    } catch (error) {
      console.error('Error actualizando usuario:', error)
      return NextResponse.json(
        { message: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  })(request)
}

/**
 * DELETE /api/users/[id] - Eliminar usuario
 */
export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const resolvedParams = await params;
    console.log('🗑️ DELETE request recibida para usuario:', resolvedParams.id)
    
    const userId = resolvedParams.id

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      console.log('❌ Usuario no encontrado:', userId)
      return NextResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Usuario encontrado:', user.email)

    // No permitir que el usuario se elimine a sí mismo
    const currentUserId = (request as any).user?.id
    if (userId === currentUserId) {
      console.log('❌ Intento de auto-eliminación bloqueado')
      return NextResponse.json(
        { message: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      )
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userId }
    })

    console.log('✅ Usuario eliminado exitosamente:', userId)

    return NextResponse.json({
      message: 'Usuario eliminado exitosamente'
    })

  } catch (error) {
    console.error('❌ Error eliminando usuario:', error)
    return NextResponse.json(
      { message: 'Error interno del servidor', error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    )
  }
}
