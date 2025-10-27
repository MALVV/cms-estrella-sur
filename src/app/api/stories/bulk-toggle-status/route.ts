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
    const { storyIds, isActive } = body

    if (!storyIds || !Array.isArray(storyIds) || storyIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requieren IDs de stories válidos' },
        { status: 400 }
      )
    }

    // Actualizar múltiples stories
    const updatedStories = await prisma.story.updateMany({
      where: {
        id: {
          in: storyIds
        }
      },
      data: { isActive }
    })

    return NextResponse.json({
      message: `${updatedStories.count} story(s) actualizada(s) exitosamente`,
      count: updatedStories.count
    })
  } catch (error) {
    console.error('Error al actualizar estado de stories en lote:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
