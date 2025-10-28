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

    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('Error fetching convocatoria:', error);
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
      title,
      description,
      fullDescription,
      requirements,
      imageUrl,
      imageAlt,
      startDate,
      endDate,
      status,
      isActive,
      isFeatured
    } = body;

    const convocatoria = await prisma.convocatoria.update({
      where: { id },
      data: {
        title,
        description,
        fullDescription,
        imageUrl,
        imageAlt,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        requirements,
        status,
        isActive,
        isFeatured,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('Error updating convocatoria:', error);
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

    await prisma.convocatoria.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Convocatoria eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting convocatoria:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

