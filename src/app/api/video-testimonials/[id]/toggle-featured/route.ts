import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT - Toggle estado destacado del video testimonial
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Verificar que el video existe
    const existingVideo = await prisma.videoTestimonial.findUnique({
      where: { id }
    })

    if (!existingVideo) {
      return NextResponse.json(
        { error: 'Video testimonial no encontrado' },
        { status: 404 }
      )
    }

    // Toggle del estado destacado
    const updatedVideo = await prisma.videoTestimonial.update({
      where: { id },
      data: {
        isFeatured: !existingVideo.isFeatured
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

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Error toggling video testimonial featured status:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
