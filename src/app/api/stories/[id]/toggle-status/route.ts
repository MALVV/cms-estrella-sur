import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json()
    const { isActive } = body

    const updatedStory = await prisma.story.update({
      where: { id },
      data: { isActive },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    const formattedStory = {
      id: updatedStory.id,
      title: updatedStory.title,
      summary: updatedStory.summary,
      imageUrl: updatedStory.imageUrl,
      imageAlt: updatedStory.imageAlt,
      status: updatedStory.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: updatedStory.createdAt.toISOString().split('T')[0],
      updatedAt: updatedStory.updatedAt.toISOString().split('T')[0],
      createdBy: updatedStory.createdBy,
      author: updatedStory.creator ? {
        id: updatedStory.creator.id,
        name: updatedStory.creator.name,
        email: updatedStory.creator.email,
        role: updatedStory.creator.role
      } : null
    }

    return NextResponse.json(formattedStory)
  } catch (error) {
    console.error('Error al actualizar estado de la story:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
