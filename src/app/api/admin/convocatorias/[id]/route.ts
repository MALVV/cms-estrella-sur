import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storageService } from '@/lib/storage-service';

// Helper para extraer bucket y key desde la URL pública
const extractBucketAndKey = (url: string): { bucket: string | null; key: string | null } => {
  try {
    if (!url) return { bucket: null, key: null };
    const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
    const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
    const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';

    // Caso 1: URL basada en dominio público del bucket (Spaces)
    const vhMatch = url.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
    if (vhMatch) {
      return { bucket: vhMatch[1], key: vhMatch[2] };
    }

    // Caso 2: URL AWS
    const awsVhMatch = url.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
    if (awsVhMatch) {
      return { bucket: awsVhMatch[1], key: awsVhMatch[2] };
    }

    // Caso 3: Path-style con endpoint
    if (endpoint && url.startsWith(endpoint + '/')) {
      const rest = url.substring((endpoint + '/').length);
      const idx = rest.indexOf('/');
      if (idx > 0) {
        const b = rest.substring(0, idx);
        const k = rest.substring(idx + 1);
        return { bucket: b, key: k };
      }
    }

    // Caso 4: Base pública exacta del bucket en env
    if (publicBase && url.startsWith(publicBase + '/')) {
      return { bucket: envBucket || null, key: url.substring((publicBase + '/').length) };
    }

    return { bucket: envBucket || null, key: null };
  } catch {
    return { bucket: null, key: null };
  }
};

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

    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('Error fetching convocatoria:', error);
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { status } = body;

    // Validar que el status sea válido
    const validStatuses = ['DRAFT', 'ACTIVE', 'UPCOMING', 'CLOSED'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    // Verificar que la convocatoria existe
    const existingConvocatoria = await prisma.convocatoria.findUnique({
      where: { id },
    });

    if (!existingConvocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    // Actualizar solo el estado
    const convocatoria = await prisma.convocatoria.update({
      where: { id },
      data: {
        status: status || existingConvocatoria.status,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('Error updating convocatoria status:', error);
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      title,
      description,
      fullDescription,
      requirements,
      imageUrl,
      imageAlt,
      startDate,
      endDate,
      status,
      isActive,
      isFeatured,
      documents,
      documentsToDelete
    } = body;

    // Obtener la convocatoria existente para comparar la imagen
    const existingConvocatoria = await prisma.convocatoria.findUnique({
      where: { id },
    });

    if (!existingConvocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }


    // Helper para normalizar imageUrl
    const normalizeImageUrlForSave = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-news.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    // Determinar si necesitamos eliminar la imagen anterior
    const oldImageUrl = existingConvocatoria.imageUrl || undefined;
    const shouldDeleteOldImage = oldImageUrl && (
      (imageUrl !== undefined && imageUrl !== null && oldImageUrl !== imageUrl) || // Reemplazo
      (imageUrl === null && oldImageUrl !== null)    // Eliminación explícita
    );

    if (shouldDeleteOldImage && oldImageUrl) {
      const { bucket: parsedBucket, key } = extractBucketAndKey(oldImageUrl);
      const bucketToUse = parsedBucket || process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';
      if (bucketToUse && key) {
        try {
          await storageService.deleteFile(bucketToUse, key);
        } catch (e) {
          console.warn('[Convocatorias][PUT] No se pudo eliminar la imagen anterior del bucket:', e);
        }
      }
    }

    // Eliminar documentos del bucket si fueron marcados para eliminar
    if (Array.isArray(documentsToDelete) && documentsToDelete.length > 0) {
      for (const doc of documentsToDelete) {
        try {
          // Manejar tanto formato antiguo (string) como nuevo (objeto)
          const docUrl = typeof doc === 'string' ? doc : (doc.url || doc);
          const { bucket: parsedBucket, key } = extractBucketAndKey(docUrl);
          const bucketToUse = parsedBucket || process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';
          if (bucketToUse && key) {
            await storageService.deleteFile(bucketToUse, key);
          }
        } catch (e) {
          console.warn('[Convocatorias][PUT] No se pudo eliminar el documento del bucket:', doc, e);
        }
      }
    }

    const convocatoria = await prisma.convocatoria.update({
      where: { id },
      data: {
        title,
        description,
        fullDescription,
        imageUrl: imageUrl !== undefined ? (imageUrl === null ? existingConvocatoria.imageUrl : (normalizeImageUrlForSave(imageUrl) || existingConvocatoria.imageUrl)) : existingConvocatoria.imageUrl,
        imageAlt: imageAlt !== undefined ? imageAlt : existingConvocatoria.imageAlt,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        requirements,
        documents: documents !== undefined ? documents : existingConvocatoria.documents,
        status,
        isActive,
        isFeatured,
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        _count: {
          select: {
            applications: true
          }
        }
      }
    });

    return NextResponse.json(convocatoria);
  } catch (error) {
    console.error('Error updating convocatoria:', error);
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    // Obtener la convocatoria para eliminar la imagen asociada
    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    // Eliminar la imagen del bucket si existe
    if (convocatoria?.imageUrl) {
      try {
        const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
        const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
        const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';

        let bucket: string | null = null;
        let key: string | null = null;

        // Caso 1: URL basada en dominio público del bucket (Spaces)
        const vhMatch = convocatoria.imageUrl.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
        if (vhMatch) {
          bucket = vhMatch[1];
          key = vhMatch[2];
        } else {
          // Caso 2: URL AWS
          const awsVhMatch = convocatoria.imageUrl.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
          if (awsVhMatch) {
            bucket = awsVhMatch[1];
            key = awsVhMatch[2];
          } else if (endpoint && convocatoria.imageUrl.startsWith(endpoint + '/')) {
            // Caso 3: Path-style con endpoint
            const rest = convocatoria.imageUrl.substring((endpoint + '/').length);
            const idx = rest.indexOf('/');
            if (idx > 0) {
              bucket = rest.substring(0, idx);
              key = rest.substring(idx + 1);
            }
          } else if (publicBase && convocatoria.imageUrl.startsWith(publicBase + '/')) {
            // Caso 4: Base pública exacta
            bucket = envBucket || null;
            key = convocatoria.imageUrl.substring((publicBase + '/').length);
          }
        }

        if (bucket && key) {
          await storageService.deleteFile(bucket, key);
        }
      } catch (e) {
        console.warn('[Convocatorias][DELETE] No se pudo eliminar la imagen del bucket:', e);
        // Continuar con la eliminación de la convocatoria aunque falle la eliminación de la imagen
      }
    }

    await prisma.convocatoria.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Convocatoria eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting convocatoria:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

