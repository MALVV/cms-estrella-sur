import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Obtener video testimonial por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const video = await prisma.videoTestimonial.findUnique({
      where: { id },
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

    if (!video) {
      return NextResponse.json(
        { error: 'Video testimonial no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error fetching video testimonial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar video testimonial
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
    const body = await request.json()
    const { title, description, youtubeUrl, thumbnailUrl, duration, isActive, isFeatured } = body

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

    // Validaciones básicas
    if (title !== undefined && !title) {
      return NextResponse.json(
        { error: 'El título es requerido' },
        { status: 400 }
      )
    }

    if (description !== undefined && !description) {
      return NextResponse.json(
        { error: 'La descripción es requerida' },
        { status: 400 }
      )
    }

    if (youtubeUrl !== undefined && !youtubeUrl) {
      return NextResponse.json(
        { error: 'La URL de YouTube es requerida' },
        { status: 400 }
      )
    }

    // Validar URL de YouTube si se proporciona
    if (youtubeUrl) {
      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/
      if (!youtubeRegex.test(youtubeUrl)) {
        return NextResponse.json(
          { error: 'URL de YouTube inválida' },
          { status: 400 }
        )
      }
    }

    const video = await prisma.videoTestimonial.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(youtubeUrl !== undefined && { youtubeUrl }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(duration !== undefined && { duration }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured })
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

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video testimonial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar video testimonial
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    await prisma.videoTestimonial.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Video testimonial eliminado exitosamente' })
  } catch (error) {
    console.error('Error deleting video testimonial:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
