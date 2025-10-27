import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Primero intentar obtener aliados destacados
    const featuredAllies = await prisma.ally.findMany({
      where: {
        isActive: true,
        isFeatured: true
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
    });

    let allies = featuredAllies;

    // Si no hay aliados destacados, mostrar algunos aliados regulares como fallback
    if (featuredAllies.length === 0) {
      const regularAllies = await prisma.ally.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 3,
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
      });
      allies = regularAllies;
    }

    const formattedAllies = allies.map((ally) => ({
      id: ally.id,
      name: ally.name,
      role: ally.role,
      description: ally.description,
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      createdAt: ally.createdAt.toISOString().split('T')[0],
      author: ally.creator ? {
        id: ally.creator.id,
        name: ally.creator.name,
        email: ally.creator.email,
        role: ally.creator.role
      } : null
    }));

    return NextResponse.json(formattedAllies);
  } catch (error) {
    console.error('❌ Error al obtener aliados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
