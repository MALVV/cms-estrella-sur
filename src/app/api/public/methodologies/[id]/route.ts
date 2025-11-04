import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';
import { storageService } from '@/lib/storage-service';

// GET /api/public/methodologies/[id] - Obtener metodología por ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const methodology = await prisma.methodology.findUnique({
      where: { id, isActive: true },
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
        imageLibrary: {
          where: {
            isActive: true,
          },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            imageAlt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!methodology) {
      return NextResponse.json({ error: 'Metodología no encontrada' }, { status: 404 });
    }

    return NextResponse.json(methodology);
  } catch (error) {
    console.error('Error fetching methodology by ID:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/public/methodologies/[id] - Actualizar metodología
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = authResult.user;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const methodology = await prisma.methodology.findUnique({
      where: { id },
    });

    if (!methodology) {
      return NextResponse.json({ error: 'Metodología no encontrada' }, { status: 404 });
    }

    if (user.role !== 'ADMINISTRATOR' && methodology.createdBy !== user.id) {
      return NextResponse.json({ error: 'No tienes permisos para editar esta metodología' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      imageUrl,
      imageAlt,
      ageGroup,
      sectors,
      targetAudience,
      objectives,
      implementation,
      results,
      methodology: methodologyContent,
      resources,
      evaluation,
      isActive,
    } = body;

    // Solo eliminar imagen anterior si se está reemplazando con una nueva (no si se está eliminando)
    // La eliminación del bucket se maneja en el frontend antes de enviar la solicitud
    const shouldDeleteOldImage = (imageUrl !== undefined && methodology.imageUrl && methodology.imageUrl !== imageUrl && imageUrl && imageUrl !== null);
    const oldImageUrl = methodology.imageUrl || undefined;

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
          await storageService.deleteFile(bucketToUse, key);
        } catch (e) {
          console.warn('[Methodologies][PUT] No se pudo eliminar la imagen anterior del bucket:', e);
        }
      }
    }

    const updatedMethodology = await prisma.methodology.update({
      where: { id },
      data: {
        title,
        description,
        shortDescription,
        imageUrl: imageUrl === undefined ? methodology.imageUrl : (imageUrl || null),
        imageAlt: imageAlt === undefined ? methodology.imageAlt : (imageAlt || null),
        ageGroup,
        sectors,
        targetAudience,
        objectives,
        implementation,
        results,
        methodology: methodologyContent,
        resources,
        evaluation,
        isActive,
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

// DELETE /api/public/methodologies/[id] - Eliminar metodología
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = authResult.user;
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const methodology = await prisma.methodology.findUnique({
      where: { id },
    });

    if (!methodology) {
      return NextResponse.json({ message: 'Metodología eliminada correctamente' });
    }

    if (user.role !== 'ADMINISTRATOR') {
      return NextResponse.json({ error: 'No tienes permisos para eliminar metodologías' }, { status: 403 });
    }

    // Intentar eliminar imagen asociada
    if (methodology.imageUrl) {
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
      const { bucket, key } = extractBucketAndKey(methodology.imageUrl);
      if (bucket && key) {
        try {
          console.log('[Methodologies][DELETE] Eliminando imagen de Space', { bucket, key, id });
          await storageService.deleteFile(bucket, key);
          console.log('[Methodologies][DELETE] Imagen eliminada exitosamente', { bucket, key, id });
        } catch (e) {
          console.warn('[Methodologies][DELETE] No se pudo eliminar imagen de metodología al borrar:', { bucket, key, id, error: String(e) });
        }
      }
    }

    // Eliminar relaciones en ImageLibrary asociadas a esta iniciativa
    const relatedImages = await prisma.imageLibrary.findMany({
      where: { methodologyId: id },
    });

    const extractBucketAndKeyForImage = (u: string): { bucket: string | null; key: string | null } => {
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

    for (const image of relatedImages) {
      // Eliminar imagen del bucket si existe
      if (image.imageUrl) {
        const { bucket, key } = extractBucketAndKeyForImage(image.imageUrl);
        if (bucket && key) {
          try {
            await storageService.deleteFile(bucket, key);
          } catch (e) {
            console.warn(`[Methodologies][DELETE] No se pudo eliminar imagen de ImageLibrary del bucket:`, e);
          }
        }
      }
      // Eliminar relación de ImageLibrary
      await prisma.imageLibrary.delete({
        where: { id: image.id },
      });
    }

    await prisma.methodology.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Metodología eliminada correctamente', deletedImage: Boolean(methodology.imageUrl) });
  } catch (error) {
    console.error('Error deleting methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
