import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

// GET - Obtener noticia específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await prisma.news.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        program: {
          select: {
            id: true,
            sectorName: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        methodology: {
          select: {
            id: true,
            title: true,
          },
        },
      } as any,
    });

    if (!news) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar noticia (requiere autenticación)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      content,
      excerpt,
      imageUrl,
      imageAlt,
      isFeatured,
      isActive,
      programId,
      projectId,
      methodologyId,
    } = body;

    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    const news = await prisma.news.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content && { content }),
        ...(excerpt !== undefined && { excerpt }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(imageAlt !== undefined && { imageAlt }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(isActive !== undefined && { isActive }),
        // Actualizar relaciones
        programId: programId || null,
        projectId: projectId || null,
        methodologyId: methodologyId || null,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
        program: {
          select: {
            id: true,
            sectorName: true,
          },
        },
        project: {
          select: {
            id: true,
            title: true,
          },
        },
        methodology: {
          select: {
            id: true,
            title: true,
          },
        },
      } as any,
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error updating news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar noticia (requiere autenticación)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const existingNews = await prisma.news.findUnique({
      where: { id },
    });

    if (!existingNews) {
      return NextResponse.json(
        { error: 'Noticia no encontrada' },
        { status: 404 }
      );
    }

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
