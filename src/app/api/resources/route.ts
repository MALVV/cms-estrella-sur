import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';

// GET - Obtener recursos (públicos o con filtros para admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const featured = searchParams.get('featured');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const search = searchParams.get('search');
    const isActive = searchParams.get('isActive');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Verificar si es una request autenticada (admin)
    const authResult = await verifyAuth(request);
    const isAuthenticated = authResult.isAuthenticated;

    const where: any = {};

    // Si no está autenticado, solo mostrar recursos activos
    if (!isAuthenticated) {
      where.isActive = true;
    } else {
      // Si está autenticado, aplicar filtros según parámetros
      if (isActive !== null) {
        where.isActive = isActive === 'true';
      }
    }

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
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo recurso (requiere autenticación)
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
      fileName,
      fileUrl,
      fileSize,
      fileType,
      category,
      subcategory,
      thumbnailUrl,
      duration,
      isFeatured = false,
    } = body;

    if (!title || !fileName || !fileUrl || !category) {
      return NextResponse.json(
        { error: 'Título, nombre de archivo, URL del archivo y categoría son requeridos' },
        { status: 400 }
      );
    }

    // Validar que la categoría sea válida
    const validCategories = ['MULTIMEDIA_CENTER', 'PUBLICATIONS'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Categoría inválida' },
        { status: 400 }
      );
    }

    // Validar subcategoría si se proporciona
    if (subcategory) {
      const validSubcategories = ['VIDEOS', 'AUDIOS', 'DIGITAL_LIBRARY', 'DOWNLOADABLE_GUIDES', 'MANUALS'];
      if (!validSubcategories.includes(subcategory)) {
        return NextResponse.json(
          { error: 'Subcategoría inválida' },
          { status: 400 }
        );
      }
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        fileName,
        fileUrl,
        fileSize,
        fileType,
        category,
        subcategory,
        thumbnailUrl,
        duration,
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

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
