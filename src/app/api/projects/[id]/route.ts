import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';
import { storageService } from '@/lib/storage-service';

// GET - Obtener proyecto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const project = await prisma.project.findUnique({
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

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el proyecto está activo para usuarios no autenticados
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated && !project.isActive) {
      return NextResponse.json(
        { error: 'Proyecto no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar proyecto (requiere autenticación)
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

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const {
      title,
      executionStart,
      executionEnd,
      context,
      objectives,
      content,
      strategicAllies,
      financing,
      imageUrl,
      imageAlt,
      isActive,
      isFeatured,
    } = body;

    // Verificar que el proyecto existe
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Solo eliminar imagen anterior si se está reemplazando con una nueva (no si se está eliminando)
    // La eliminación del bucket se maneja en el frontend antes de enviar la solicitud
    const shouldDeleteOldImage = (imageUrl !== undefined && existingProject.imageUrl && existingProject.imageUrl !== imageUrl && imageUrl && imageUrl !== null);
    const oldImageUrl = existingProject.imageUrl || undefined;

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
          console.warn('[Projects][PUT] No se pudo eliminar la imagen anterior del bucket:', e);
        }
      }
    }

    // Función helper para normalizar imageUrl antes de guardar
    const normalizeImageUrlForSave = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-news.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (executionStart !== undefined) updateData.executionStart = new Date(executionStart);
    if (executionEnd !== undefined) updateData.executionEnd = new Date(executionEnd);
    if (context !== undefined) updateData.context = context;
    if (objectives !== undefined) updateData.objectives = objectives;
    if (content !== undefined) updateData.content = content;
    if (strategicAllies !== undefined) updateData.strategicAllies = strategicAllies;
    if (financing !== undefined) updateData.financing = financing;
    if (imageUrl !== undefined) {
      const normalized = normalizeImageUrlForSave(imageUrl);
      if (normalized !== null) {
        updateData.imageUrl = normalized;
      } else {
        updateData.imageUrl = null;
      }
    }
    if (imageAlt !== undefined) updateData.imageAlt = imageAlt || null;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Función helper para normalizar imageUrl antes de devolver
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-news.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    const normalizedProject = {
      ...project,
      imageUrl: normalizeImageUrl(project.imageUrl),
      imageAlt: project.imageAlt || null,
    };

    return NextResponse.json(normalizedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar proyecto (requiere autenticación)
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

    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Buscar para obtener imageUrl
    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json(
        { message: 'Proyecto eliminado exitosamente' },
        { status: 200 }
      );
    }

    // Helper para extraer bucket y key desde URL
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

    // Intentar eliminar imagen asociada
    if (existingProject.imageUrl) {
      const { bucket, key } = extractBucketAndKey(existingProject.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('No se pudo eliminar imagen de proyecto al borrar:', e);
        }
      }
    }

    // Eliminar relaciones en ImageLibrary asociadas a este proyecto
    const relatedImages = await prisma.imageLibrary.findMany({
      where: { projectId: id },
    });

    for (const image of relatedImages) {
      // Eliminar imagen del bucket si existe
      if (image.imageUrl) {
        const { bucket, key } = extractBucketAndKey(image.imageUrl);
        if (bucket && key) {
          try {
            await storageService.deleteFile(bucket, key);
          } catch (e) {
            console.warn(`[Projects][DELETE] No se pudo eliminar imagen de ImageLibrary del bucket:`, e);
          }
        }
      }
      // Eliminar relación de ImageLibrary
      await prisma.imageLibrary.delete({
        where: { id: image.id },
      });
    }

    await prisma.project.delete({ where: { id } });
    return NextResponse.json(
      { message: 'Proyecto eliminado exitosamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
