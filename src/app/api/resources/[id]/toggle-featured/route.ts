import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';

// PUT - Alternar estado destacado de un recurso
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verificar que el recurso existe
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Alternar el estado destacado
    const resource = await prisma.resource.update({
      where: { id },
      data: {
        isFeatured: !existingResource.isFeatured,
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

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error toggling featured status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
