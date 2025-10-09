import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener todos los videos testimoniales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || 'all'
    const featured = searchParams.get('featured') || 'all'

    const skip = (page - 1) * limit

    // Construir filtros
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (status !== 'all') {
      where.isActive = status === 'active'
    }

    if (featured !== 'all') {
      where.isFeatured = featured === 'featured'
    }

    const [videos, total] = await Promise.all([
      prisma.videoTestimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.videoTestimonial.count({ where })
    ])

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching video testimonials:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST - Crear nuevo video testimonial
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, youtubeUrl, thumbnailUrl, duration, isActive, isFeatured } = body

    // Validaciones básicas
    if (!title || !description || !youtubeUrl) {
      return NextResponse.json(
        { error: 'Título, descripción y URL de YouTube son requeridos' },
        { status: 400 }
      )
    }

    // Validar URL de YouTube - expresión regular mejorada
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/
    if (!youtubeRegex.test(youtubeUrl)) {
      return NextResponse.json(
        { error: 'URL de YouTube inválida. Formatos válidos: https://www.youtube.com/watch?v=..., https://youtu.be/..., https://www.youtube.com/embed/...' },
        { status: 400 }
      )
    }

    const video = await prisma.videoTestimonial.create({
      data: {
        title,
        description,
        youtubeUrl,
        thumbnailUrl,
        duration,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        createdBy: session.user.id
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

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video testimonial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
