import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const story = await prisma.story.findUnique({
      where: { 
        id,
        isActive: true // Solo stories activas
      },
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

    if (!story) {
      return NextResponse.json(
        { error: 'Story no encontrada' },
        { status: 404 }
      )
    }

    const formattedStory = {
      id: story.id,
      title: story.title,
      content: story.content,
      imageUrl: story.imageUrl,
      imageAlt: story.imageAlt,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
      author: story.creator ? {
        id: story.creator.id,
        name: story.creator.name,
        email: story.creator.email,
        role: story.creator.role
      } : null
    }

    return NextResponse.json(formattedStory)
  } catch (error) {
    console.error('Error al obtener story:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
