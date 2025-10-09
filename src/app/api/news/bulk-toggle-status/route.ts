import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// PATCH - Activar/desactivar múltiples noticias
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { newsIds, isActive } = await request.json();

    if (!newsIds || !Array.isArray(newsIds) || newsIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere una lista de IDs de noticias' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'isActive debe ser un valor booleano' },
        { status: 400 }
      );
    }

    // Actualizar múltiples noticias
    const result = await prisma.news.updateMany({
      where: {
        id: {
          in: newsIds
        }
      },
      data: {
        isActive
      }
    });

    return NextResponse.json({
      message: `${result.count} noticia(s) ${isActive ? 'activada(s)' : 'desactivada(s)'} exitosamente`,
      updatedCount: result.count
    });

  } catch (error) {
    console.error('Error al actualizar estado de noticias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
