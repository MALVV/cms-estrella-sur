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
        program: {
          select: {
            id: true,
            sectorName: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        },
        methodology: {
          select: {
            id: true,
            title: true
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
    const { imageUrl, imageAlt, title, programId, projectId, methodologyId } = body;

    // Validaciones
    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL de imagen es requerida' },
        { status: 400 }
      );
    }

    // Verificar que al menos una relación está presente
    if (!programId && !projectId && !methodologyId) {
      return NextResponse.json(
        { error: 'Debe especificar al menos un programa, proyecto o iniciativa' },
        { status: 400 }
      );
    }

    // Verificar que las entidades existen
    if (programId) {
      const programa = await prisma.program.findUnique({
        where: { id: programId }
      });
      if (!programa) {
        return NextResponse.json(
          { error: 'Programa no encontrado' },
          { status: 404 }
        );
      }
    }

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId }
      });
      if (!project) {
        return NextResponse.json(
          { error: 'Proyecto no encontrado' },
          { status: 404 }
        );
      }
    }

    if (methodologyId) {
      const methodology = await prisma.methodology.findUnique({
        where: { id: methodologyId }
      });
      if (!methodology) {
        return NextResponse.json(
          { error: 'Iniciativa no encontrada' },
          { status: 404 }
        );
      }
    }

    const image = await prisma.imageLibrary.create({
      data: {
        imageUrl,
        imageAlt: imageAlt || null,
        title: title || 'Sin título',
        programId: programId || null,
        projectId: projectId || null,
        methodologyId: methodologyId || null,
        createdBy: session.user.id
      },
      include: {
        program: {
          select: {
            id: true,
            sectorName: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        },
        methodology: {
          select: {
            id: true,
            title: true
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
