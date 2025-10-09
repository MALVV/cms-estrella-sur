import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const methodology = await prisma.methodology.findUnique({
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

    if (!methodology) {
      return NextResponse.json(
        { error: 'Metodología no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(methodology);
  } catch (error) {
    console.error('Error fetching methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
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
      methodology,
      resources,
      evaluation,
    } = body;

    const updatedMethodology = await prisma.methodology.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(shortDescription && { shortDescription }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(imageAlt !== undefined && { imageAlt }),
        ...(ageGroup && { ageGroup }),
        ...(category && { category }),
        ...(targetAudience && { targetAudience }),
        ...(objectives && { objectives }),
        ...(implementation && { implementation }),
        ...(results && { results }),
        ...(methodology !== undefined && { methodology }),
        ...(resources !== undefined && { resources }),
        ...(evaluation !== undefined && { evaluation }),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo isActive debe ser un booleano' },
        { status: 400 }
      );
    }

    const updatedMethodology = await prisma.methodology.update({
      where: { id },
      data: { isActive },
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
    console.error('Error updating methodology status:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const methodology = await prisma.methodology.findUnique({
      where: { id },
    });

    if (!methodology) {
      return NextResponse.json(
        { error: 'Metodología no encontrada' },
        { status: 404 }
      );
    }

    await prisma.methodology.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Metodología eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}