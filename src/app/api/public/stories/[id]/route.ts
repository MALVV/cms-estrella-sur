import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const story = await prisma.stories.findUnique({
      where: { 
        id,
        isActive: true // Solo stories activas
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
      summary: story.summary,
      imageUrl: story.imageUrl,
      imageAlt: story.imageAlt,
      createdAt: story.createdAt.toISOString(),
      updatedAt: story.updatedAt.toISOString(),
      author: story.users ? {
        id: story.users.id,
        name: story.users.name,
        email: story.users.email,
        role: story.users.role
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
