import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { storageService } from '@/lib/storage-service';

// GET - Obtener una imagen específica
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
    const image = await prisma.imageLibrary.findUnique({
      where: { id },
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

    if (!image) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar una imagen
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
    const { imageUrl, imageAlt, title, programId, projectId, methodologyId } = body;

    // Verificar que la imagen existe
    const existingImage = await prisma.imageLibrary.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // Helper para extraer bucket y key
    const extractBucketAndKey = (url: string): { bucket: string | null; key: string | null } => {
      try {
        if (!url) return { bucket: null, key: null };
        const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
        const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
        const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';
        const vhMatch = url.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
        if (vhMatch) return { bucket: vhMatch[1], key: vhMatch[2] };
        const awsVhMatch = url.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
        if (awsVhMatch) return { bucket: awsVhMatch[1], key: awsVhMatch[2] };
        if (endpoint && url.startsWith(endpoint + '/')) {
          const rest = url.substring((endpoint + '/').length);
          const idx = rest.indexOf('/');
          if (idx > 0) return { bucket: rest.substring(0, idx), key: rest.substring(idx + 1) };
        }
        if (publicBase && url.startsWith(publicBase + '/')) {
          return { bucket: envBucket || null, key: url.substring((publicBase + '/').length) };
        }
        return { bucket: envBucket || null, key: null };
      } catch {
        return { bucket: null, key: null };
      }
    };

    // Si se está reemplazando la imagen o eliminando, eliminar la anterior del bucket
    if (imageUrl !== existingImage.imageUrl && existingImage.imageUrl) {
      const { bucket, key } = extractBucketAndKey(existingImage.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[ImageGallery][PUT] No se pudo eliminar imagen anterior del bucket:', e);
        }
      }
    }

    // Validaciones
    if (!imageUrl || imageUrl.trim() === '') {
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

    const image = await prisma.imageLibrary.update({
      where: { id },
      data: {
        imageUrl,
        imageAlt: imageAlt || null,
        title: title || 'Sin título',
        programId: programId || null,
        projectId: projectId || null,
        methodologyId: methodologyId || null
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

    return NextResponse.json(image);
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una imagen
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
    // Verificar que la imagen existe
    const existingImage = await prisma.imageLibrary.findUnique({
      where: { id }
    });

    if (!existingImage) {
      return NextResponse.json(
        { error: 'Imagen no encontrada' },
        { status: 404 }
      );
    }

    // Helper para extraer bucket y key
    const extractBucketAndKey = (url: string): { bucket: string | null; key: string | null } => {
      try {
        if (!url) return { bucket: null, key: null };
        const publicBase = (process.env.AWS_S3_PUBLIC_URL || process.env.AWS_URL || '').replace(/\/$/, '');
        const endpoint = (process.env.AWS_S3_ENDPOINT || process.env.AWS_ENDPOINT || '').replace(/\/$/, '');
        const envBucket = process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET || '';
        const vhMatch = url.match(/^https?:\/\/([^\.]+)\.[^\/]+digitaloceanspaces\.com\/(.+)$/);
        if (vhMatch) return { bucket: vhMatch[1], key: vhMatch[2] };
        const awsVhMatch = url.match(/^https?:\/\/([^\.]+)\.s3\.[^\/]+\.amazonaws\.com\/(.+)$/);
        if (awsVhMatch) return { bucket: awsVhMatch[1], key: awsVhMatch[2] };
        if (endpoint && url.startsWith(endpoint + '/')) {
          const rest = url.substring((endpoint + '/').length);
          const idx = rest.indexOf('/');
          if (idx > 0) return { bucket: rest.substring(0, idx), key: rest.substring(idx + 1) };
        }
        if (publicBase && url.startsWith(publicBase + '/')) {
          return { bucket: envBucket || null, key: url.substring((publicBase + '/').length) };
        }
        return { bucket: envBucket || null, key: null };
      } catch {
        return { bucket: null, key: null };
      }
    };

    // Eliminar imagen del bucket si existe
    if (existingImage.imageUrl) {
      const { bucket, key } = extractBucketAndKey(existingImage.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[ImageGallery][DELETE] No se pudo eliminar imagen del bucket:', e);
        }
      }
    }

    await prisma.imageLibrary.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Imagen eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
