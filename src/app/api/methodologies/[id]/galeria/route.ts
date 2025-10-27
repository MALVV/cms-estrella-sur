import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener imágenes de una iniciativa/metodología específica (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar que la metodología existe y está activa
    const methodology = await prisma.methodology.findUnique({
      where: { 
        id,
        isActive: true 
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        imageAlt: true
      }
    });

    if (!methodology) {
      return NextResponse.json(
        { error: 'Iniciativa no encontrada' },
        { status: 404 }
      );
    }

    // Obtener todas las imágenes activas de la metodología
    const images = await prisma.imageLibrary.findMany({
      where: {
        methodologyId: id,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageAlt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      methodology,
      images
    });
  } catch (error) {
    console.error('Error fetching methodology images:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

