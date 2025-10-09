import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

export async function PATCH(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { methodologyIds, isActive } = body;

    if (!Array.isArray(methodologyIds) || methodologyIds.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere una lista de IDs de metodologías' },
        { status: 400 }
      );
    }

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo isActive debe ser un booleano' },
        { status: 400 }
      );
    }

    const result = await prisma.methodology.updateMany({
      where: {
        id: {
          in: methodologyIds,
        },
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json({
      message: `${result.count} metodología(s) actualizada(s) exitosamente`,
      count: result.count,
    });
  } catch (error) {
    console.error('Error bulk updating methodologies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
