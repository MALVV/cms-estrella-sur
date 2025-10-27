import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener imágenes de un proyecto específico (público)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Verificar que el proyecto existe y está activo
    const project = await prisma.project.findUnique({
      where: { 
        id,
        isActive: true 
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        imageAlt: true
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Obtener todas las imágenes activas del proyecto
    const images = await prisma.imageLibrary.findMany({
      where: {
        projectId: id,
        isActive: true
      },
      select: {
        id: true,
        title: true,
        imageUrl: true,
        imageAlt: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      project,
      images
    });
  } catch (error) {
    console.error('Error fetching project images:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

