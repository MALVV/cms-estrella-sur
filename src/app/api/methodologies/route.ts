import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { ageGroup: { contains: search, mode: 'insensitive' } },
        { targetAudience: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    if (sector && sector !== 'all') {
      where.sectors = {
        has: sector
      };
    }

    const [methodologies, total] = await Promise.all([
      prisma.methodology.findMany({
        where,
        include: {
          creator: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.methodology.count({ where }),
    ]);

    return NextResponse.json({
      methodologies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching methodologies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
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

    if (!title || !description || !shortDescription || !ageGroup || !targetAudience || !objectives || !implementation || !results) {
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

    return NextResponse.json(newMethodology, { status: 201 });
  } catch (error) {
    console.error('Error creating methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
