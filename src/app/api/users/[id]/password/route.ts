import { NextRequest, NextResponse } from 'next/server'
import { withSimpleRole } from '@/lib/simple-auth-middleware'
import { UserRole } from '@/lib/roles'
import { prisma } from '@/lib/prisma'
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/security'

/**
 * PUT /api/users/[id]/password - Cambiar contraseña de usuario
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withSimpleRole([UserRole.ADMINISTRATOR], async (authenticatedRequest) => {
    try {
      const { id: userId } = await params
      const { newPassword, currentPassword } = await authenticatedRequest.json()

      if (!newPassword) {
        return NextResponse.json(
          { message: 'Nueva contraseña es requerida' },
          { status: 400 }
        )
      }

      // Verificar que el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!user) {
        return NextResponse.json(
          { message: 'Usuario no encontrado' },
          { status: 404 }
        )
      }

      // Si es el usuario actual, verificar contraseña actual
      const currentUserId = authenticatedRequest.user?.id
      if (userId === currentUserId && currentPassword) {
        const isCurrentPasswordValid = await verifyPassword(currentPassword, user.password)
        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { message: 'Contraseña actual incorrecta' },
            { status: 400 }
          )
        }
      }

      // Validar fortaleza de la nueva contraseña
      const passwordValidation = validatePasswordStrength(newPassword)
      if (!passwordValidation.isValid) {
        return NextResponse.json(
          { 
            message: 'La contraseña no cumple con los requisitos de seguridad',
            errors: passwordValidation.errors
          },
          { status: 400 }
        )
      }

      // Encriptar nueva contraseña
      const hashedPassword = await hashPassword(newPassword)

      // Actualizar contraseña
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
          mustChangePassword: false // Resetear flag de cambio obligatorio
        }
      })

      return NextResponse.json({
        message: 'Contraseña actualizada exitosamente'
      })

    } catch (error) {
      console.error('Error cambiando contraseña:', error)
      return NextResponse.json(
        { message: 'Error interno del servidor' },
        { status: 500 }
      )
    }
  })(request)
}