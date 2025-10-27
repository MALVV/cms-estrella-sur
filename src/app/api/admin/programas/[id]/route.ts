import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const programa = await prisma.program.findUnique({
      where: { id: id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        news: {
          where: { isActive: true },
          orderBy: { publishedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            excerpt: true,
            imageUrl: true,
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
            imageAlt: true
          }
        }
      }
    });

    if (!programa) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    return NextResponse.json(programa);
  } catch (error) {
    console.error('Error fetching programa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      sectorName,
      description,
      imageUrl,
      imageAlt,
      presentationVideo,
      odsAlignment,
      resultsAreas,
      results,
      targetGroups,
      contentTopics,
      moreInfoLink,
      isActive
    } = body;

    const programa = await prisma.program.update({
      where: { id: id },
      data: {
        sectorName,
        description,
        imageUrl,
        imageAlt,
        presentationVideo,
        odsAlignment,
        resultsAreas,
        results,
        targetGroups,
        contentTopics,
        moreInfoLink,
        isActive
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(programa);
  } catch (error) {
    console.error('Error updating programa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    
    // Verificar si el programa existe
    const programa = await prisma.program.findUnique({
      where: { id: id }
    });

    if (!programa) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    // Eliminar el programa de la base de datos
    await prisma.program.delete({
      where: { id: id }
    });

    return NextResponse.json({ message: 'Programa eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting programa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
