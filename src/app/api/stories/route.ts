import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'ALL'
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Construir filtros
    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { summary: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'ALL') {
      where.isActive = status === 'ACTIVE'
    }

    // Obtener stories con información del creador
    const stories = await (prisma as any).stories.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
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

    const formattedStories = stories.map((story: any) => ({
      id: story.id,
      title: story.title,
      content: story.content,
      summary: story.summary,
      imageUrl: story.imageUrl,
      imageAlt: story.imageAlt,
      status: story.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: story.createdAt.toISOString().split('T')[0],
      updatedAt: story.updatedAt.toISOString().split('T')[0],
      createdBy: story.createdBy,
      author: story.users ? {
        id: story.users.id,
        name: story.users.name,
        email: story.users.email,
        role: story.users.role
      } : null
    }))

    return NextResponse.json(formattedStories)
  } catch (error) {
    console.error('Error al obtener stories:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('🔍 Sesión obtenida:', {
      hasSession: !!session,
      hasUser: !!session?.user,
      userId: session?.user?.id,
      userEmail: session?.user?.email
    })
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, summary, imageUrl, imageAlt } = body

    if (!title || !content || !summary) {
      return NextResponse.json(
        { error: 'Título, contenido y resumen son requeridos' },
        { status: 400 }
      )
    }

    // Generar ID único para la story
    const storyId = `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Obtener el ID del usuario de la sesión
    const createdBy = session.user.id
    
    if (!createdBy) {
      console.error('❌ No se encontró userId en la sesión del usuario')
      return NextResponse.json({ error: 'Error de autenticación: ID de usuario no encontrado' }, { status: 401 })
    }
    
    console.log('✅ Creando story para usuario:', {
      id: createdBy,
      email: session.user.email,
      name: session.user.name
    })

    const newStory = await (prisma as any).stories.create({
      data: {
        id: storyId,
        title,
        content,
        summary,
        imageUrl: imageUrl || '/placeholder-story.jpg',
        imageAlt: imageAlt || title,
        isActive: true,
        createdBy: createdBy
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
      id: newStory.id,
      title: newStory.title,
      content: newStory.content,
      summary: newStory.summary,
      imageUrl: newStory.imageUrl,
      imageAlt: newStory.imageAlt,
      status: newStory.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: newStory.createdAt.toISOString().split('T')[0],
      updatedAt: newStory.updatedAt.toISOString().split('T')[0],
      createdBy: newStory.createdBy,
      author: newStory.users ? {
        id: newStory.users.id,
        name: newStory.users.name,
        email: newStory.users.email,
        role: newStory.users.role
      } : null
    }

    return NextResponse.json(formattedStory, { status: 201 })
  } catch (error) {
    console.error('Error al crear story:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
