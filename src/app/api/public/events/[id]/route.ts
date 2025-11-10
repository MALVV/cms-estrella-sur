import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const { id } = resolvedParams
  
  try {

    const event = await prisma.event.findUnique({
      where: { 
        id,
        isActive: true // Solo eventos activos
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      )
    }

    const formattedEvent = {
      id: event.id,
      title: event.title,
      content: event.content,
      imageUrl: event.imageUrl,
      imageAlt: event.imageAlt,
      eventDate: event.eventDate.toISOString(),
      location: event.location,
      isFeatured: event.isFeatured,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      organizer: event.organizer ? {
        id: event.organizer.id,
        name: event.organizer.name,
        email: event.organizer.email,
        role: event.organizer.role
      } : null
    }

    return NextResponse.json(formattedEvent)
  } catch (error) {
    console.error(`Error al obtener evento con ID ${id}:`, error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
