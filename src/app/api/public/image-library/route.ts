import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('programId');
    const projectId = searchParams.get('projectId');
    const methodologyId = searchParams.get('methodologyId');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      isActive: true,
    };

    if (programId) {
      where.programId = programId;
    }

    if (projectId) {
      where.projectId = projectId;
    }

    if (methodologyId) {
      where.methodologyId = methodologyId;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const images = await prisma.imageLibrary.findMany({
      where,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        imageAlt: true,
        createdAt: true,
        program: {
          select: { id: true, sectorName: true }
        },
        project: {
          select: { id: true, title: true }
        },
        methodology: {
          select: { id: true, title: true }
        }
      }
    });

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error fetching public images:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
