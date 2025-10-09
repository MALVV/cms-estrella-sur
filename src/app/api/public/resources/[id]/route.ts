import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener un recurso específico público
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
      where: { 
        id,
        isActive: true, // Solo recursos activos para usuarios públicos
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Incrementar contador de descargas
    await prisma.resource.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching public resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
