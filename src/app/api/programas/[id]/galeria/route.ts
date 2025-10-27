import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener imágenes de un programa específico (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar que el programa existe y está activo
    const programa = await prisma.program.findUnique({
      where: { 
        id,
        isActive: true 
      },
      select: {
        id: true,
        sectorName: true,
        description: true,
        imageUrl: true,
        imageAlt: true
      }
    });

    if (!programa) {
      return NextResponse.json(
        { error: 'Programa no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todas las imágenes activas del programa
    const images = await prisma.imageLibrary.findMany({
      where: {
        programId: id,
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
      programa,
      images
    });
  } catch (error) {
    console.error('Error fetching program images:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
