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
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const programId = searchParams.get('programId');
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    const where: {
      isActive: boolean;
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
      programId?: string;
      isFeatured?: boolean;
    } = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (programId) {
      where.programId = programId;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [images, total] = await Promise.all([
      prisma.imageLibrary.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: { id: true, name: true, email: true }
          },
          program: {
            select: { id: true, sectorName: true }
          }
        }
      }),
      prisma.imageLibrary.count({ where })
    ]);

    return NextResponse.json({
      images,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching image library:', error);
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
      imageUrl,
      imageAlt,
      fileName,
      fileSize,
      fileType,
      programId,
      isFeatured = false
    } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Título e imagen son requeridos' },
        { status: 400 }
      );
    }

    const image = await prisma.imageLibrary.create({
      data: {
        title,
        description,
        imageUrl,
        imageAlt,
        fileName,
        fileSize,
        fileType,
        programId,
        isFeatured,
        createdBy: session.user.id
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        program: {
          select: { id: true, sectorName: true }
        }
      }
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
