import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// PATCH - Actualizar estado de denuncia
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validar que el estado sea válido
    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const complaint = await (prisma as any).complaint.update({
      where: { id },
      data: {
        status,
        reviewedAt: status !== 'PENDING' ? new Date() : null,
        reviewedBy: status !== 'PENDING' ? session.user.id : null
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error al actualizar denuncia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar denuncia
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await (prisma as any).complaint.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Denuncia eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar denuncia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
