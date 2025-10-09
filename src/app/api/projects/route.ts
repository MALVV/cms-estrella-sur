import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET - Obtener proyectos (públicos o con filtros para admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'executionStart';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Verificar si es una request autenticada (admin)
    const authResult = await verifyAuth(request);
    const isAuthenticated = authResult.isAuthenticated;

    const where: any = {};

    // Si no está autenticado, solo mostrar proyectos activos
    if (!isAuthenticated) {
      where.isActive = true;
    } else {
      // Si está autenticado, aplicar filtros según parámetros
      if (isActive !== null) {
        where.isActive = isActive === 'true';
      }
    }

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
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo proyecto (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      executionStart,
      executionEnd,
      context,
      objectives,
      content,
      strategicAllies,
      financing,
      imageUrl,
      imageAlt,
      isFeatured = false,
    } = body;

    if (!title || !executionStart || !executionEnd || !context || !objectives || !content) {
      return NextResponse.json(
        { error: 'Título, fechas de ejecución, contexto, objetivos y contenido son requeridos' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        executionStart: new Date(executionStart),
        executionEnd: new Date(executionEnd),
        context,
        objectives,
        content,
        strategicAllies,
        financing,
        imageUrl,
        imageAlt,
        isFeatured,
        createdBy: authResult.user.id,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
