import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { applicationId } = await params;

    const application = await prisma.convocatoriaApplication.findUnique({
      where: { id: applicationId },
      include: {
        convocatoria: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: 'Aplicación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { applicationId } = await params;
    const body = await request.json();

    const { status } = body;

    if (!status || !['PENDING', 'REVIEWING', 'APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const application = await prisma.convocatoriaApplication.update({
      where: { id: applicationId },
      data: {
        status,
      },
      include: {
        convocatoria: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { applicationId } = await params;

    await prisma.convocatoriaApplication.delete({
      where: { id: applicationId }
    });

    return NextResponse.json({ message: 'Aplicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

