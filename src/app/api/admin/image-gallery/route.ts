import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las imágenes de la galería
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const images = await prisma.imageLibrary.findMany({
      include: {
        programa: {
          select: {
            id: true,
            nombreSector: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(images);
  } catch (error) {
    console.error('Error fetching image gallery:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva imagen en la galería
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { imageUrl, imageAlt, title, programaId } = body;

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

    const image = await prisma.imageLibrary.create({
      data: {
        imageUrl,
        imageAlt: imageAlt || null,
        title: title || 'Sin título',
        programaId,
        createdBy: session.user.id
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

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error('Error creating image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
