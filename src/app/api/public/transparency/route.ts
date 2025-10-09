import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener documentos de transparencia públicos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {
      isActive: true, // Solo documentos activos para usuarios públicos
    };

    if (category) {
      where.category = category;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (year) {
      where.year = year;
    }

    // Agregar búsqueda por título y descripción
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { fileName: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'year') {
      orderBy.year = sortOrder;
    } else if (sortBy === 'category') {
      orderBy.category = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const documents = await prisma.transparencyDocument.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching public transparency documents:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
