import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener proyectos públicos (solo activos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'executionStart';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const where: any = {
      isActive: true, // Solo proyectos activos
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    // Agregar búsqueda por título, contexto y objetivos
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { context: { contains: search, mode: 'insensitive' } },
        { objectives: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else if (sortBy === 'executionEnd') {
      orderBy.executionEnd = sortOrder;
    } else {
      orderBy.executionStart = sortOrder;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            news: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
