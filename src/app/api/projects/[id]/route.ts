import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET - Obtener proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el proyecto está activo para usuarios no autenticados
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated && !project.isActive) {
      return NextResponse.json(
        { error: 'Proyecto no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar proyecto (requiere autenticación)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const {
      title,
      executionStart,
      executionEnd,
      context,
      objectives,
      content,
      strategicAllies,
      financing,
      imageUrl,
      imageAlt,
      isActive,
      isFeatured,
    } = body;

    // Verificar que el proyecto existe
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (executionStart !== undefined) updateData.executionStart = new Date(executionStart);
    if (executionEnd !== undefined) updateData.executionEnd = new Date(executionEnd);
    if (context !== undefined) updateData.context = context;
    if (objectives !== undefined) updateData.objectives = objectives;
    if (content !== undefined) updateData.content = content;
    if (strategicAllies !== undefined) updateData.strategicAllies = strategicAllies;
    if (financing !== undefined) updateData.financing = financing;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar proyecto (requiere autenticación)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Intentar eliminar el proyecto directamente
    // Si no existe, considerarlo como ya eliminado
    try {
      await prisma.project.delete({
        where: { id },
      });

      return NextResponse.json(
        { message: 'Proyecto eliminado exitosamente' },
        { status: 200 }
      );
    } catch (deleteError: any) {
      // Si el error es porque el proyecto no existe, considerarlo como eliminado exitosamente
      if (deleteError.code === 'P2025' || deleteError.message?.includes('Record to delete does not exist')) {
        return NextResponse.json(
          { message: 'Proyecto eliminado exitosamente' },
          { status: 200 }
        );
      }
      
      // Si es otro error, lanzarlo
      throw deleteError;
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
