import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Obtener videos testimoniales públicos (solo activos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const featured = searchParams.get('featured') || 'all'

    const skip = (page - 1) * limit

    // Construir filtros - solo videos activos
    const where: any = {
      isActive: true
    }

    if (featured === 'featured') {
      where.isFeatured = true
    }

    const [videos, total] = await Promise.all([
      prisma.videoTestimonial.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          title: true,
          description: true,
          youtubeUrl: true,
          thumbnailUrl: true,
          duration: true,
          isFeatured: true,
          createdAt: true,
          updatedAt: true
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
    console.error('Error fetching public video testimonials:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
