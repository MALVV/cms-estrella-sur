import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Listar todos los álbumes públicos activos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featuredOnly = searchParams.get('featured') === 'true';

    const albums = await prisma.album.findMany({
      where: {
        isActive: true,
        ...(featuredOnly && { isFeatured: true }),
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        _count: {
          select: {
            images: {
              where: { isActive: true },
            },
          },
        },
        images: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          take: 1, // Solo tomar la primera imagen para usarla como miniatura
          select: {
            id: true,
            imageUrl: true,
            caption: true,
          },
        },
      },
    });

    // Transformar para incluir thumbnailImage en la respuesta
    const albumsWithThumbnail = albums.map(album => ({
      ...album,
      thumbnailImage: album.images && album.images.length > 0 ? album.images[0] : null,
    }));

    return NextResponse.json(albumsWithThumbnail);
  } catch (error) {
    console.error('Error al obtener álbumes públicos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

