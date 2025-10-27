import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';

// GET - Obtener un documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.transparencyDocument.findUnique({
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

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el documento está activo (para usuarios no autenticados)
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated && !document.isActive) {
      return NextResponse.json(
        { error: 'Documento no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching transparency document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un documento específico
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
      year,
      isActive,
      isFeatured,
    } = body;

    // Verificar que el documento existe
    const existingDocument = await prisma.transparencyDocument.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Validar que la categoría sea válida si se proporciona
    if (category) {
      const validCategories = ['DOCUMENT_CENTER', 'ACCOUNTABILITY', 'FINANCIERS_AND_ALLIES', 'ANNUAL_REPORTS'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Categoría inválida' },
          { status: 400 }
        );
      }
    }

    const document = await prisma.transparencyDocument.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(fileName && { fileName }),
        ...(fileUrl && { fileUrl }),
        ...(fileSize !== undefined && { fileSize }),
        ...(fileType && { fileType }),
        ...(category && { category }),
        ...(year !== undefined && { year }),
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

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating transparency document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un documento específico
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

    // Verificar que el documento existe
    const existingDocument = await prisma.transparencyDocument.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    await prisma.transparencyDocument.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting transparency document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
