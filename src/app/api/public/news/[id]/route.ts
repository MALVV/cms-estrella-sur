import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  try {

    const news = await prisma.news.findUnique({
      where: { 
        id,
        isActive: true // Solo noticias activas
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!news) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      )
    }

    const formattedNews = {
      id: news.id,
      title: news.title,
      content: news.content,
      imageUrl: news.imageUrl,
      imageAlt: news.imageAlt,
      isFeatured: news.isFeatured,
      publishedAt: news.publishedAt.toISOString(),
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
      author: news.author ? {
        id: news.author.id,
        name: news.author.name,
        email: news.author.email,
        role: news.author.role
      } : null
    }

    return NextResponse.json(formattedNews)
  } catch (error) {
    console.error(`Error al obtener noticia con ID ${id}:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
