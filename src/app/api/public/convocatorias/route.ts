import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: any = {
      isActive: true, // Solo convocatorias activas públicamente
    };

    // Filtro por estado (ACTIVE, UPCOMING, CLOSED)
    if (status) {
      where.status = status;
    }

    // Solo mostrar convocatorias que no están en DRAFT públicamente
    where.status = { not: 'DRAFT' };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fullDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'startDate') {
      orderBy.startDate = sortOrder;
    } else if (sortBy === 'endDate') {
      orderBy.endDate = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const convocatorias = await prisma.convocatoria.findMany({
      where,
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
      orderBy,
      take: limit,
    });

    return NextResponse.json(convocatorias);
  } catch (error) {
    console.error('Error fetching convocatorias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

