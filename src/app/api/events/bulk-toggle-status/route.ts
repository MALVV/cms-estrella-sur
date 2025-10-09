import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// PATCH - Activar/desactivar múltiples eventos
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { eventIds, isActive } = await request.json();

    if (!eventIds || !Array.isArray(eventIds) || eventIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere una lista de IDs de eventos' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive debe ser un valor booleano' },
        { status: 400 }
      );
    }

    // Actualizar múltiples eventos
    const result = await prisma.event.updateMany({
      where: {
        id: {
          in: eventIds
        }
      },
      data: {
        isActive
      }
    });

    return NextResponse.json({
      message: `${result.count} evento(s) ${isActive ? 'activado(s)' : 'desactivado(s)'} exitosamente`,
      updatedCount: result.count
    });

  } catch (error) {
    console.error('Error al actualizar estado de eventos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
