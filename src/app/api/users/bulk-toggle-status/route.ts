import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { userIds, isActive } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren IDs de usuarios válidos' },
        { status: 400 }
      )
    }

    // Actualizar múltiples usuarios
    const updatedUsers = await prisma.user.updateMany({
      where: {
        id: {
          in: userIds
        }
      },
      data: { isActive }
    })

    return NextResponse.json({
      message: `${updatedUsers.count} usuario(s) actualizado(s) exitosamente`,
      count: updatedUsers.count
    })
  } catch (error) {
    console.error('Error al actualizar estado de usuarios en lote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
