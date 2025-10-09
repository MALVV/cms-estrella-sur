import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const programaId = searchParams.get('programaId');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {
      isActive: true,
    };

    if (programaId) {
      where.programaId = programaId;
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
        programa: {
          select: { id: true, nombreSector: true }
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
