import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = await params;
    const { id } = resolvedParams

    // Verificar que la story existe
    const existingStory = await prisma.stories.findUnique({
      where: { id }
    })

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la story
    await prisma.stories.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Story eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar story:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = await params;
    const { id } = resolvedParams
    const body = await request.json()
    const { title, content, summary, imageUrl, imageAlt, isActive } = body

    // Verificar que la story existe
    const existingStory = await prisma.stories.findUnique({
      where: { id }
    })

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story no encontrada' },
        { status: 404 }
      )
    }

    // Validar datos requeridos
    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'Título, contenido y resumen son requeridos' },
        { status: 400 }
      )
    }

    // Actualizar la story
    const updatedStory = await prisma.stories.update({
      where: { id },
      data: {
        title,
        content,
        summary,
        imageUrl: imageUrl || existingStory.imageUrl,
        imageAlt: imageAlt || existingStory.imageAlt,
        isActive: isActive !== undefined ? isActive : existingStory.isActive
      },
      include: {
        users: {
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
      content: updatedStory.content,
      summary: updatedStory.summary,
      imageUrl: updatedStory.imageUrl,
      imageAlt: updatedStory.imageAlt,
      status: updatedStory.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: updatedStory.createdAt.toISOString().split('T')[0],
      updatedAt: updatedStory.updatedAt.toISOString().split('T')[0],
      createdBy: updatedStory.createdBy,
      author: updatedStory.users ? {
        id: updatedStory.users.id,
        name: updatedStory.users.name,
        email: updatedStory.users.email,
        role: updatedStory.users.role
      } : null
    }

    return NextResponse.json(formattedStory)
  } catch (error) {
    console.error('Error al actualizar story:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
