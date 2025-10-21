import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET - Obtener noticias (públicas o con filtros para admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Verificar si es una request autenticada (admin)
    const authResult = await verifyAuth(request);
    const isAuthenticated = authResult.isAuthenticated;

    const where: any = {};

    // Si no está autenticado, solo mostrar noticias activas
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

    // Agregar búsqueda por título y contenido
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.publishedAt = sortOrder;
    }

    const news = await prisma.news.findMany({
      where,
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        programa: {
          select: {
            id: true,
            nombreSector: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        methodology: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva noticia (requiere autenticación)
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
      content,
      excerpt,
      imageUrl,
      imageAlt,
      isFeatured = false,
      programaId,
      projectId,
      methodologyId,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        content,
        excerpt,
        imageUrl,
        imageAlt,
        isFeatured,
        programaId,
        projectId,
        methodologyId,
        createdBy: authResult.user.id,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        programa: {
          select: {
            id: true,
            nombreSector: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        methodology: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
