import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// POST - Cambiar estado de múltiples proyectos
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { projectIds, isActive } = body;

    if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere una lista de IDs de proyectos' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'El estado isActive debe ser un booleano' },
        { status: 400 }
      );
    }

    // Actualizar múltiples proyectos
    const result = await prisma.project.updateMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json({
      message: `${result.count} proyectos actualizados exitosamente`,
      updatedCount: result.count,
    });
  } catch (error) {
    console.error('Error updating projects status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
