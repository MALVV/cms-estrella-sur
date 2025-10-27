import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'ALL';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    const where: {
      isActive?: boolean;
      OR?: Array<{
        sectorName?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};

    // Filtro por estado
    if (status === 'ACTIVE') {
      where.isActive = true;
    } else if (status === 'INACTIVE') {
      where.isActive = false;
    }
    // Si es 'ALL', no aplicamos filtro de estado

    if (search) {
      where.OR = [
        { sectorName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    const orderBy: {
      sectorName?: 'asc' | 'desc';
      updatedAt?: 'asc' | 'desc';
      createdAt?: 'asc' | 'desc';
    } = {};
    if (sortBy === 'sectorName') {
      orderBy.sectorName = sortOrder;
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [programas, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: {
              news: true,
              imageLibrary: true
            }
          }
        }
      }),
      prisma.program.count({ where })
    ]);

    return NextResponse.json({
      programas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching programas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const {
      nombreSector,
      descripcion,
      imageUrl,
      imageAlt,
      videoPresentacion,
      alineacionODS,
      subareasResultados,
      resultados,
      gruposAtencion,
      contenidosTemas,
      enlaceMasInformacion,
      isFeatured = false
    } = body;

    if (!nombreSector || !descripcion) {
      return NextResponse.json(
        { error: 'Nombre del sector y descripción son requeridos' },
        { status: 400 }
      );
    }

    const programa = await prisma.program.create({
      data: {
        sectorName: nombreSector,
        description: descripcion,
        imageUrl,
        imageAlt,
        presentationVideo: videoPresentacion,
        odsAlignment: alineacionODS,
        resultsAreas: subareasResultados,
        results: resultados,
        targetGroups: gruposAtencion,
        contentTopics: contenidosTemas,
        moreInfoLink: enlaceMasInformacion,
        isFeatured,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(programa, { status: 201 });
  } catch (error) {
    console.error('Error creating programa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
