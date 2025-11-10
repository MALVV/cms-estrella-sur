import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener todos los aliados activos para la página de aliados estratégicos
    const allies = await prisma.ally.findMany({
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
      }
    })

    const formattedAllies = allies.map((ally) => ({
      id: ally.id,
      name: ally.name,
      role: ally.role,
      description: ally.description,
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      isFeatured: ally.isFeatured || false,
      createdAt: ally.createdAt.toISOString().split('T')[0],
      author: ally.creator ? {
        id: ally.creator.id,
        name: ally.creator.name,
        email: ally.creator.email,
        role: ally.creator.role
      } : null
    }))

    return NextResponse.json(formattedAllies)
  } catch (error) {
    console.error('Error al obtener todos los aliados:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
