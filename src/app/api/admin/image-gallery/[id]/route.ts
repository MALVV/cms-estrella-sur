import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener una imagen específica
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
    const image = await prisma.imageLibrary.findUnique({
      where: { id },
      include: {
        programa: {
          select: {
            id: true,
            nombreSector: true
          }
        }
      }
    });

    if (!image) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una imagen
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
    const { imageUrl, imageAlt, title, programaId } = body;

    // Verificar que la imagen existe
    const existingImage = await prisma.imageLibrary.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // Validaciones
    if (!imageUrl || !programaId) {
      return NextResponse.json(
        { error: 'URL de imagen y programa son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el programa existe
    const programa = await prisma.programas.findUnique({
      where: { id: programaId }
    });

    if (!programa) {
      return NextResponse.json(
        { error: 'Programa no encontrado' },
        { status: 404 }
      );
    }

    const image = await prisma.imageLibrary.update({
      where: { id },
      data: {
        imageUrl,
        imageAlt: imageAlt || null,
        title: title || 'Sin título',
        programaId
      },
      include: {
        programa: {
          select: {
            id: true,
            nombreSector: true
          }
        }
      }
    });

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una imagen
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
    // Verificar que la imagen existe
    const existingImage = await prisma.imageLibrary.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    await prisma.imageLibrary.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
