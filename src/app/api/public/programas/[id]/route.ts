import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const programa = await prisma.program.findUnique({
      where: { 
        id: id,
        isActive: true 
      },
      include: {
        news: {
          where: { isActive: true },
          orderBy: { publishedAt: 'desc' },
          select: {
            id: true,
            title: true,
            content: true,
            imageUrl: true,
            imageAlt: true,
            publishedAt: true
          }
        },
        imageLibrary: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            imageAlt: true,
            createdAt: true
          }
        }
      }
    });

    if (!programa) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    return NextResponse.json(programa);
  } catch (error) {
    console.error('Error fetching public programa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
