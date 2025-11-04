import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { storageService } from '@/lib/storage-service';

// GET - Obtener un álbum específico
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

    const album = await prisma.album.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        images: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            images: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(album);
  } catch (error) {
    console.error('Error al obtener álbum:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un álbum
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
    const { title, description, isActive, isFeatured } = body;

    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    const album = await prisma.album.update({
      where: { id },
      data: {
        title: title !== undefined ? title.trim() : undefined,
        description: description !== undefined ? (description.trim() || null) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
        isFeatured: isFeatured !== undefined ? isFeatured : undefined,
      },
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
            images: {
              where: { isActive: true },
            },
          },
        },
      },
    });

    return NextResponse.json(album);
  } catch (error) {
    console.error('Error al actualizar álbum:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un álbum
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

    const existingAlbum = await prisma.album.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!existingAlbum) {
      return NextResponse.json(
        { error: 'Álbum no encontrado' },
        { status: 404 }
      );
    }

    // Helper para extraer bucket y key de una URL
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

    // Eliminar todas las imágenes del bucket antes de eliminar el álbum
    const deleteErrors: Array<{ imageId: string; imageUrl: string; error: string }> = [];
    
    for (const image of existingAlbum.images) {
      const { bucket, key } = extractBucketAndKey(image.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
          console.log(`[Albums][DELETE] Imagen eliminada del bucket: ${image.id} - ${image.imageUrl}`);
        } catch (e) {
          const errorMsg = e instanceof Error ? e.message : String(e);
          console.warn(`[Albums][DELETE] No se pudo eliminar imagen del bucket: ${image.id} - ${image.imageUrl}`, errorMsg);
          deleteErrors.push({
            imageId: image.id,
            imageUrl: image.imageUrl,
            error: errorMsg,
          });
        }
      } else {
        console.warn(`[Albums][DELETE] No se pudo extraer bucket/key de la URL: ${image.imageUrl}`);
      }
    }

    // Eliminar el álbum (las imágenes se eliminan automáticamente por onDelete: Cascade)
    await prisma.album.delete({
      where: { id },
    });

    console.log(`[Albums][DELETE] Álbum ${id} eliminado correctamente. ${existingAlbum.images.length} imágenes procesadas.`);
    
    if (deleteErrors.length > 0) {
      console.warn(`[Albums][DELETE] Advertencia: ${deleteErrors.length} imágenes no se pudieron eliminar del bucket:`, deleteErrors);
    }

    return NextResponse.json({
      success: true,
      message: 'Álbum eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar álbum:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

