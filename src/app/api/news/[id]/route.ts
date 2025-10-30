import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';
import { storageService } from '@/lib/storage-service';

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

    // Función helper para normalizar imageUrl
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-news.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const normalizedNews = {
      ...news,
      imageUrl: normalizeImageUrl(news.imageUrl),
      imageAlt: news.imageAlt || null,
    };

    return NextResponse.json(normalizedNews);
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

    // Solo eliminar imagen anterior si se está reemplazando con una nueva (no si se está eliminando)
    // La eliminación del bucket se maneja en el frontend antes de enviar la solicitud
    const shouldDeleteOldImage = (imageUrl !== undefined && existingNews.imageUrl && existingNews.imageUrl !== imageUrl && imageUrl && imageUrl !== null);
    const oldImageUrl = existingNews.imageUrl || undefined;
    
    console.log('[News][PUT] Verificación de eliminación de imagen:', {
      id,
      imageUrl,
      existingNewsImageUrl: existingNews.imageUrl,
      shouldDeleteOldImage,
      imageMarkedForDeletion: 'N/A (backend no tiene esta info)'
    });

    // Helpers para extraer bucket y key desde la URL pública
    const extractBucketAndKey = (url: string): { bucket: string | null; key: string | null } => {
      try {
        if (!url) return { bucket: null, key: null };
        const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
        const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
        const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';

        // Caso 1: URL basada en dominio público del bucket (Spaces): https://<bucket>.<region>.digitaloceanspaces.com/<key>
        const vhMatch = url.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
        if (vhMatch) {
          return { bucket: vhMatch[1], key: vhMatch[2] };
        }

        // Caso 2: URL AWS: https://<bucket>.s3.<region>.amazonaws.com/<key>
        const awsVhMatch = url.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
        if (awsVhMatch) {
          return { bucket: awsVhMatch[1], key: awsVhMatch[2] };
        }

        // Caso 3: Path-style con endpoint: https://endpoint/<bucket>/<key>
        if (endpoint && url.startsWith(endpoint + '/')) {
          const rest = url.substring((endpoint + '/').length);
          const idx = rest.indexOf('/');
          if (idx > 0) {
            const b = rest.substring(0, idx);
            const k = rest.substring(idx + 1);
            return { bucket: b, key: k };
          }
        }

        // Caso 4: Base pública exacta del bucket en env: publicBase/key
        if (publicBase && url.startsWith(publicBase + '/')) {
          return { bucket: envBucket || null, key: url.substring((publicBase + '/').length) };
        }

        return { bucket: envBucket || null, key: null };
      } catch {
        return { bucket: null, key: null };
      }
    };

    if (shouldDeleteOldImage && oldImageUrl) {
      const { bucket: parsedBucket, key } = extractBucketAndKey(oldImageUrl);
      const bucketToUse = parsedBucket || process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';
      if (bucketToUse && key) {
        try {
          console.log('[News][PUT] Eliminando imagen anterior del bucket (reemplazo):', { bucket: bucketToUse, key, id });
          await storageService.deleteFile(bucketToUse, key);
        } catch (e) {
          console.warn('[News][PUT] No se pudo eliminar la imagen anterior del bucket:', e);
        }
      } else {
        console.log('[News][PUT] No se puede eliminar imagen - bucket o key no encontrados:', { bucket: bucketToUse, key });
      }
    } else {
      console.log('[News][PUT] No se eliminará imagen anterior:', { shouldDeleteOldImage, oldImageUrl: !!oldImageUrl });
    }

    // Función helper para normalizar imageUrl antes de guardar
    const normalizeImageUrlForSave = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-news.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title ?? existingNews.title,
        content: content ?? existingNews.content,
        excerpt: excerpt === undefined ? existingNews.excerpt : excerpt,
        imageUrl: imageUrl === undefined ? normalizeImageUrlForSave(existingNews.imageUrl) : normalizeImageUrlForSave(imageUrl),
        imageAlt: imageAlt === undefined ? existingNews.imageAlt : (imageAlt || null),
        isFeatured: isFeatured ?? existingNews.isFeatured,
        isActive: isActive ?? existingNews.isActive,
        // Actualizar relaciones
        programId: programId ?? null,
        projectId: projectId ?? null,
        methodologyId: methodologyId ?? null,
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

    // Función helper para normalizar imageUrl antes de devolver
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-news.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const normalizedNews = {
      ...news,
      imageUrl: normalizeImageUrl(news.imageUrl),
      imageAlt: news.imageAlt || null,
    };

    return NextResponse.json(normalizedNews);
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

    // Intentar eliminar imagen asociada (y no es placeholder)
    if (existingNews.imageUrl && existingNews.imageUrl !== '/placeholder-news.jpg') {
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
      const { bucket, key } = extractBucketAndKey(existingNews.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('No se pudo eliminar imagen de noticia al borrar:', e);
        }
      }
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
