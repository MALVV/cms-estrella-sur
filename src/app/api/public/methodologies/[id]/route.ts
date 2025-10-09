import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET /api/public/methodologies/[id] - Obtener metodología por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const methodology = await prisma.methodology.findUnique({
      where: { id, isActive: true },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!methodology) {
      return NextResponse.json({ error: 'Metodología no encontrada' }, { status: 404 });
    }

    return NextResponse.json(methodology);
  } catch (error) {
    console.error('Error fetching methodology by ID:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/public/methodologies/[id] - Actualizar metodología
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = authResult.user;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const methodology = await prisma.methodology.findUnique({
      where: { id },
    });

    if (!methodology) {
      return NextResponse.json({ error: 'Metodología no encontrada' }, { status: 404 });
    }

    if (user.role !== 'ADMINISTRADOR' && methodology.createdBy !== user.id) {
      return NextResponse.json({ error: 'No tienes permisos para editar esta metodología' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      imageUrl,
      imageAlt,
      ageGroup,
      category,
      targetAudience,
      objectives,
      implementation,
      results,
      methodology: methodologyContent,
      resources,
      evaluation,
      isActive,
    } = body;

    const updatedMethodology = await prisma.methodology.update({
      where: { id },
      data: {
        title,
        description,
        shortDescription,
        imageUrl,
        imageAlt,
        ageGroup,
        category,
        targetAudience,
        objectives,
        implementation,
        results,
        methodology: methodologyContent,
        resources,
        evaluation,
        isActive,
      },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedMethodology);
  } catch (error) {
    console.error('Error updating methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/public/methodologies/[id] - Eliminar metodología
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = authResult.user;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const methodology = await prisma.methodology.findUnique({
      where: { id },
    });

    if (!methodology) {
      return NextResponse.json({ error: 'Metodología no encontrada' }, { status: 404 });
    }

    if (user.role !== 'ADMINISTRADOR') {
      return NextResponse.json({ error: 'No tienes permisos para eliminar metodologías' }, { status: 403 });
    }

    await prisma.methodology.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Metodología eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
