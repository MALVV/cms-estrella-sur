import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST - Agregar imágenes masivamente a un álbum
export async function POST(
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
    const { images } = body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'Se requiere un array de imágenes' },
        { status: 400 }
      );
    }

    // Verificar que el álbum existe
    const album = await prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    // Validar que todas las imágenes tengan imageUrl
    const invalidImages = images.filter(
      (img: any) => !img.imageUrl || img.imageUrl.trim() === ''
    );
    if (invalidImages.length > 0) {
      return NextResponse.json(
        { error: 'Todas las imágenes deben tener una URL válida' },
        { status: 400 }
      );
    }

    // Crear todas las imágenes
    const createdImages = await prisma.galleryImage.createMany({
      data: images.map((img: any) => ({
        imageUrl: img.imageUrl.trim(),
        caption: img.caption?.trim() || null,
        albumId: id,
        createdBy: session.user.id,
        isActive: img.isActive !== undefined ? img.isActive : true,
      })),
    });

    // Obtener las imágenes creadas con sus relaciones
    const newImages = await prisma.galleryImage.findMany({
      where: {
        albumId: id,
        createdAt: {
          gte: new Date(Date.now() - 1000), // Último segundo
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({
      success: true,
      count: createdImages.count,
      images: newImages,
    });
  } catch (error) {
    console.error('Error al agregar imágenes al álbum:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// GET - Obtener todas las imágenes de un álbum
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

    const images = await prisma.galleryImage.findMany({
      where: { albumId: id },
      orderBy: { createdAt: 'asc' },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error al obtener imágenes del álbum:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

