import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    // Si no está activa o está en estado DRAFT, no permitir acceso
    if (!convocatoria.isActive || convocatoria.status === 'DRAFT') {
      return NextResponse.json(
        { error: 'Convocatoria no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('Error fetching convocatoria:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

