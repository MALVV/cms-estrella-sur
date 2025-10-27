import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET - Obtener eventos (públicos o con filtros para admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'eventDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    // Verificar si es una request autenticada (admin)
    const authResult = await verifyAuth(request);
    const isAuthenticated = authResult.isAuthenticated;

    const where: any = {};

    // Si no está autenticado, solo mostrar eventos activos
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

    // Agregar búsqueda por título y descripción
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    if (sortBy === 'title') {
      orderBy.title = sortOrder;
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.eventDate = sortOrder;
    }

    const events = await prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo evento (requiere autenticación)
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
      description,
      imageUrl,
      imageAlt,
      eventDate,
      location,
      isFeatured = false,
    } = body;

    if (!title || !description || !eventDate) {
      return NextResponse.json(
        { error: 'Título, descripción y fecha del evento son requeridos' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        imageAlt,
        eventDate: new Date(eventDate),
        location,
        isFeatured,
        createdBy: authResult.user.id,
      },
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
