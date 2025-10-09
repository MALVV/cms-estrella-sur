import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';

// PUT - Alternar estado de múltiples recursos
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { ids, isActive } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de IDs válido' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive debe ser un valor booleano' },
        { status: 400 }
      );
    }

    // Actualizar múltiples recursos
    const result = await prisma.resource.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json({
      message: `${result.count} recursos actualizados exitosamente`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error bulk updating resources:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
