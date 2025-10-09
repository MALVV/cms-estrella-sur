import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener recursos públicos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {
      isActive: true, // Solo recursos activos para usuarios públicos
    };

    if (category) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (featured === 'true') {
      where.isFeatured = true;
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
    } else if (sortBy === 'category') {
      orderBy.category = sortOrder;
    } else if (sortBy === 'downloadCount') {
      orderBy.downloadCount = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const resources = await prisma.resource.findMany({
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

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Error fetching public resources:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
