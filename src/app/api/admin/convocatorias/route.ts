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
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    const where: any = {};

    // Filtro por estado
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // Filtro por activo/inactivo
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fullDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'startDate') {
      orderBy.startDate = sortOrder;
    } else if (sortBy === 'endDate') {
      orderBy.endDate = sortOrder;
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [convocatorias, total] = await Promise.all([
      prisma.convocatoria.findMany({
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
              applications: true
            }
          }
        }
      }),
      prisma.convocatoria.count({ where })
    ]);

    return NextResponse.json({
      convocatorias,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching convocatorias:', error);
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
      title,
      description,
      fullDescription,
      content,
      requirements,
      imageUrl,
      imageAlt,
      startDate,
      endDate,
      status = 'DRAFT',
      isActive = true,
      isFeatured = false
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: 'Título y descripción son requeridos' },
        { status: 400 }
      );
    }

    const convocatoria = await prisma.convocatoria.create({
      data: {
        title,
        description,
        fullDescription: fullDescription || description,
        imageUrl: imageUrl || '',
        imageAlt,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        objectives: [],
        responsibilities: [],
        qualifications: [],
        benefits: [],
        requirements,
        documents: [],
        status,
        isActive,
        isFeatured,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(convocatoria, { status: 201 });
  } catch (error) {
    console.error('Error creating convocatoria:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

