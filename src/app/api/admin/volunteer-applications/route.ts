import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '50');

    // Construir filtros
    const where: any = {};
    if (status) {
      where.status = status;
    }

    // Obtener aplicaciones
    const [applications, total] = await Promise.all([
      prisma.volunteerApplication.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take,
      }),
      prisma.volunteerApplication.count({ where })
    ]);

    return NextResponse.json({
      applications,
      total,
      skip,
      take
    });
  } catch (error) {
    console.error('Error fetching volunteer applications:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

