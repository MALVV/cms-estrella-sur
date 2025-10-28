import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET /api/public/methodologies - Obtener todas las metodologías activas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectors = searchParams.get('sectors');
    const ageGroup = searchParams.get('ageGroup');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      isActive: true,
    };

    if (sectors) {
      where.sectors = {
        some: {
          name: sectors
        }
      };
    }

    if (ageGroup) {
      where.ageGroup = {
        contains: ageGroup,
        mode: 'insensitive',
      };
    }

    const methodologies = await prisma.methodology.findMany({
      where,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json(methodologies);
  } catch (error) {
    console.error('Error fetching methodologies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/public/methodologies - Crear nueva metodología (solo admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = authResult.user;
    if (user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'No tienes permisos para crear metodologías' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      imageUrl,
      imageAlt,
      ageGroup,
      sectors,
      targetAudience,
      objectives,
      implementation,
      results,
      methodology,
      resources,
      evaluation,
    } = body;

    if (!title || !description || !shortDescription || !ageGroup || !sectors || !targetAudience || !objectives || !implementation || !results) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const newMethodology = await prisma.methodology.create({
      data: {
        title,
        description,
        shortDescription,
        imageUrl,
        imageAlt,
        ageGroup,
        sectors,
        targetAudience,
        objectives,
        implementation,
        results,
        methodology,
        resources,
        evaluation,
        createdBy: user.id,
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

    return NextResponse.json(newMethodology, { status: 201 });
  } catch (error) {
    console.error('Error creating methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
