import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { isFeatured } = body;

    if (typeof isFeatured !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo isFeatured debe ser un booleano' },
        { status: 400 }
      );
    }

    const existingMethodology = await prisma.methodology.findUnique({
      where: { id },
    });

    if (!existingMethodology) {
      return NextResponse.json({ error: 'Metodología no encontrada' }, { status: 404 });
    }

    const updatedMethodology = await prisma.methodology.update({
      where: { id },
      data: { isFeatured },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMethodology);
  } catch (error) {
    console.error('Error updating methodology featured status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
