import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');

    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const [programas, total] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          imageLibrary: {
            where: { isActive: true },
            select: {
              id: true,
              title: true,
              description: true,
              imageUrl: true,
              imageAlt: true
            }
          },
          _count: {
            select: {
              news: true,
              imageLibrary: true
            }
          }
        }
      }),
      prisma.program.count({ where })
    ]);

    return NextResponse.json({
      programas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching public programas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
