import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const methodologyId = searchParams.get('methodologyId');
    const programaId = searchParams.get('programaId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!projectId && !methodologyId && !programaId) {
      return NextResponse.json(
        { error: 'Se requiere projectId, methodologyId o programaId' },
        { status: 400 }
      );
    }

    const where: any = {
      isActive: true,
    };

    if (projectId) {
      where.projectId = projectId;
    }

    if (methodologyId) {
      where.methodologyId = methodologyId;
    }

    if (programaId) {
      where.programaId = programaId;
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
      orderBy: {
        publishedAt: 'desc',
      },
      take: limit,
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error('Error fetching related news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
