import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener solo stories activas para la landing page
    const stories = await prisma.story.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
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
      author: story.creator ? {
        id: story.creator.id,
        name: story.creator.name,
        email: story.creator.email,
        role: story.creator.role
      } : null
    }))

    return NextResponse.json(formattedStories)
  } catch (error: any) {
    console.error('Error al obtener stories públicas:', error)
    
    // Proporcionar más información sobre el error
    const errorMessage = error?.message || 'Error desconocido'
    const errorCode = error?.code || 'UNKNOWN_ERROR'
    
    // Verificar si es un error de conexión a la base de datos
    if (errorMessage.includes('Can\'t reach database server') || errorCode === 'P1001') {
      console.error('Error de conexión a la base de datos:', {
        message: errorMessage,
        code: errorCode,
        databaseUrl: process.env.DATABASE_URL ? 'configurada' : 'no configurada'
      })
      
      return NextResponse.json(
        { 
          error: 'Error de conexión a la base de datos',
          details: 'No se pudo conectar al servidor de base de datos. Verifica que el servidor esté corriendo y que las credenciales sean correctas.'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
