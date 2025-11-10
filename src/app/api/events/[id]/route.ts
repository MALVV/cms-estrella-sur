import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';
import { storageService } from '@/lib/storage-service';

// GET - Obtener evento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: {
        id,
        isActive: true,
      },
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Función helper para normalizar imageUrl
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-event.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const normalizedEvent = {
      ...event,
      imageUrl: normalizeImageUrl(event.imageUrl),
      imageAlt: event.imageAlt || null,
    };

    return NextResponse.json(normalizedEvent);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar evento (requiere autenticación)
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
      imageUrl,
      imageAlt,
      eventDate,
      location,
      isFeatured,
      isActive,
    } = body;

    const existingEvent = await prisma.event.findUnique({ where: { id } });

    if (!existingEvent) {
      // Idempotente: considerar eliminado
      return NextResponse.json({ message: 'Evento eliminado exitosamente' });
    }

    // Función helper para normalizar imageUrl antes de guardar
    const normalizeImageUrlForSave = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-event.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    // Preparar datos para actualizar
    const updateData: any = {};
    if (title) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = normalizeImageUrlForSave(imageUrl);
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt || null;
    if (eventDate) updateData.eventDate = new Date(eventDate);
    if (location !== undefined) updateData.location = location;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isActive !== undefined) updateData.isActive = isActive;

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
      include: {
        organizer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Función helper para normalizar imageUrl antes de devolver
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-event.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const normalizedEvent = {
      ...event,
      imageUrl: normalizeImageUrl(event.imageUrl),
      imageAlt: event.imageAlt || null,
    };

    return NextResponse.json(normalizedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar evento (requiere autenticación)
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

    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Evento no encontrado' },
        { status: 404 }
      );
    }

    // Intentar eliminar imagen asociada (y no es placeholder)
    if (existingEvent.imageUrl && existingEvent.imageUrl !== '/placeholder-event.jpg') {
      const extractBucketAndKey = (u: string): { bucket: string | null; key: string | null } => {
        try {
          const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
          const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
          const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';
          const vhMatch = u.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
          if (vhMatch) return { bucket: vhMatch[1], key: vhMatch[2] };
          const awsVhMatch = u.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
          if (awsVhMatch) return { bucket: awsVhMatch[1], key: awsVhMatch[2] };
          if (endpoint && u.startsWith(endpoint + '/')) {
            const rest = u.substring((endpoint + '/').length);
            const idx = rest.indexOf('/');
            if (idx > 0) return { bucket: rest.substring(0, idx), key: rest.substring(idx + 1) };
          }
          if (publicBase && u.startsWith(publicBase + '/')) {
            return { bucket: envBucket || null, key: u.substring((publicBase + '/').length) };
          }
          return { bucket: envBucket || null, key: null };
        } catch {
          return { bucket: null, key: null };
        }
      };
      const { bucket, key } = extractBucketAndKey(existingEvent.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('No se pudo eliminar imagen de evento al borrar:', e);
        }
      }
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Evento eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
