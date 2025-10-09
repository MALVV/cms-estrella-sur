import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener solo stories activas para la landing page
    const stories = await prisma.stories.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
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
      },
      take: 6 // Limitar a 6 stories para la landing
    })

    const formattedStories = stories.map(story => ({
      id: story.id,
      title: story.title,
      content: story.content,
      summary: story.summary,
      imageUrl: story.imageUrl,
      imageAlt: story.imageAlt,
      createdAt: story.createdAt.toISOString().split('T')[0],
      author: story.users ? {
        id: story.users.id,
        name: story.users.name,
        email: story.users.email,
        role: story.users.role
      } : null
    }))

    return NextResponse.json(formattedStories)
  } catch (error) {
    console.error('Error al obtener stories públicas:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
