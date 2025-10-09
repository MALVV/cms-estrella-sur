import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Obtener todos los aliados activos para la página de aliados estratégicos
    const allies = await (prisma as any).allies.findMany({
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
      }
    })

    const formattedAllies = allies.map((ally: any) => ({
      id: ally.id,
      name: ally.name,
      role: ally.role,
      description: ally.description,
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      isFeatured: ally.isFeatured || false,
      createdAt: ally.createdAt.toISOString().split('T')[0],
      author: ally.users ? {
        id: ally.users.id,
        name: ally.users.name,
        email: ally.users.email,
        role: ally.users.role
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
