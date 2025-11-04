import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth-middleware';
import { storageService } from '@/lib/storage-service';

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
      sectors,
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
        ...(sectors && { sectors }),
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

    // Eliminar relaciones en ImageLibrary asociadas a esta iniciativa
    const relatedImages = await prisma.imageLibrary.findMany({
      where: { methodologyId: id },
    });

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

    for (const image of relatedImages) {
      // Eliminar imagen del bucket si existe
      if (image.imageUrl) {
        const { bucket, key } = extractBucketAndKey(image.imageUrl);
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

    return NextResponse.json({ message: 'Metodología eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting methodology:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}