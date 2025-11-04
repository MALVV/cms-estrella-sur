import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';
import { storageService } from '@/lib/storage-service';

// GET - Obtener un recurso específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const resource = await prisma.resource.findUnique({
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

    if (!resource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el recurso está activo (para usuarios no autenticados)
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated && !resource.isActive) {
      return NextResponse.json(
        { error: 'Recurso no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un recurso específico
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
      fileType,
      category,
      subcategory,
      thumbnailUrl,
      isActive,
      isFeatured,
    } = body;

    // Verificar que el recurso existe
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Validar que la categoría sea válida si se proporciona
    if (category) {
      const validCategories = ['MULTIMEDIA_CENTER', 'PUBLICATIONS'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Categoría inválida' },
          { status: 400 }
        );
      }
    }

    // Validar subcategoría si se proporciona
    if (subcategory) {
      const validSubcategories = ['VIDEOS', 'AUDIOS', 'DIGITAL_LIBRARY', 'DOWNLOADABLE_GUIDES', 'MANUALS'];
      if (!validSubcategories.includes(subcategory)) {
        return NextResponse.json(
          { error: 'Subcategoría inválida' },
          { status: 400 }
        );
      }
    }

    // Helpers para normalizar URLs
    const normalizeUrl = (url: string | null | undefined): string | null => {
      if (!url || url.trim() === '' || url === 'null') return null;
      return url.trim();
    };

    const extractBucketAndKey = (u: string): { bucket: string | null; key: string | null } => {
      try {
        if (!u) return { bucket: null, key: null };
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

    // Manejar eliminación de archivo anterior si se reemplaza o elimina
    const oldFileUrl = normalizeUrl(existingResource.fileUrl);
    const newFileUrl = normalizeUrl(fileUrl);
    const shouldDeleteOldFile = oldFileUrl && (
      (newFileUrl && oldFileUrl !== newFileUrl) || // Reemplazo
      (newFileUrl === null && oldFileUrl !== null) || // Eliminación explícita
      (fileUrl === '' && oldFileUrl !== null) // Cadena vacía
    );

    if (shouldDeleteOldFile && oldFileUrl) {
      const { bucket, key } = extractBucketAndKey(oldFileUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Resources][PUT] No se pudo eliminar archivo anterior del bucket:', e);
        }
      }
    }

    // Manejar eliminación de miniatura anterior si se reemplaza o elimina
    const oldThumbnailUrl = normalizeUrl(existingResource.thumbnailUrl);
    const newThumbnailUrl = normalizeUrl(thumbnailUrl);
    const shouldDeleteOldThumbnail = oldThumbnailUrl && (
      (newThumbnailUrl && oldThumbnailUrl !== newThumbnailUrl) || // Reemplazo
      (newThumbnailUrl === null && oldThumbnailUrl !== null) || // Eliminación explícita
      (thumbnailUrl === null && oldThumbnailUrl !== null) // null explícito
    );

    if (shouldDeleteOldThumbnail && oldThumbnailUrl) {
      const { bucket, key } = extractBucketAndKey(oldThumbnailUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Resources][PUT] No se pudo eliminar miniatura anterior del bucket:', e);
        }
      }
    }

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(fileName && { fileName }),
        ...(fileUrl !== undefined && fileUrl !== '' && fileUrl !== null && { fileUrl }),
        ...(fileType && { fileType }),
        ...(category && { category }),
        ...(subcategory !== undefined && { subcategory }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl: thumbnailUrl === null || thumbnailUrl === '' ? null : thumbnailUrl }),
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

    return NextResponse.json(resource);
  } catch (error) {
    console.error('Error updating resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un recurso específico
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

    // Verificar que el recurso existe
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!existingResource) {
      return NextResponse.json(
        { error: 'Recurso no encontrado' },
        { status: 404 }
      );
    }

    // Helper para extraer bucket y key
    const extractBucketAndKey = (u: string): { bucket: string | null; key: string | null } => {
      try {
        if (!u) return { bucket: null, key: null };
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

    // Eliminar archivo del bucket si existe (no crítico si falla)
    if (existingResource.fileUrl) {
      const { bucket, key } = extractBucketAndKey(existingResource.fileUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Resources][DELETE] No se pudo eliminar archivo del bucket:', e);
          // No fallar la eliminación si no se puede borrar del bucket
        }
      }
    }

    // Eliminar miniatura del bucket si existe (no crítico si falla)
    if (existingResource.thumbnailUrl) {
      const { bucket, key } = extractBucketAndKey(existingResource.thumbnailUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Resources][DELETE] No se pudo eliminar miniatura del bucket:', e);
          // No fallar la eliminación si no se puede borrar del bucket
        }
      }
    }

    // Eliminar el recurso de la base de datos
    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Recurso eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting resource:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
