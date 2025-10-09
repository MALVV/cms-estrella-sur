import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';

// GET - Obtener un recurso específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
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

    if (!resource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el recurso está activo (para usuarios no autenticados)
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated && !resource.isActive) {
      return NextResponse.json(
        { error: 'Recurso no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un recurso específico
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

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      fileName,
      fileUrl,
      fileSize,
      fileType,
      category,
      subcategory,
      thumbnailUrl,
      duration,
      isActive,
      isFeatured,
    } = body;

    // Verificar que el recurso existe
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Validar que la categoría sea válida si se proporciona
    if (category) {
      const validCategories = ['CENTRO_MULTIMEDIA', 'PUBLICACIONES'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Categoría inválida' },
          { status: 400 }
        );
      }
    }

    // Validar subcategoría si se proporciona
    if (subcategory) {
      const validSubcategories = ['VIDEOS', 'AUDIOS', 'REPRODUCTOR_INTEGRADO', 'BIBLIOTECA_DIGITAL', 'GUIAS_DESCARGABLES', 'MANUALES'];
      if (!validSubcategories.includes(subcategory)) {
        return NextResponse.json(
          { error: 'Subcategoría inválida' },
          { status: 400 }
        );
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(fileName && { fileName }),
        ...(fileUrl && { fileUrl }),
        ...(fileSize !== undefined && { fileSize }),
        ...(fileType && { fileType }),
        ...(category && { category }),
        ...(subcategory !== undefined && { subcategory }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(duration !== undefined && { duration }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
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

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un recurso específico
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

    const { id } = await params;

    // Verificar que el recurso existe
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Recurso eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
