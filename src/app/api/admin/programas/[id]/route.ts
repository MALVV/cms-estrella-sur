import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { storageService } from '@/lib/storage-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
    const programa = await prisma.program.findUnique({
      where: { id: id },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        },
        news: {
          where: { isActive: true },
          orderBy: { publishedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            title: true,
            excerpt: true,
            imageUrl: true,
            publishedAt: true
          }
        },
        imageLibrary: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            imageAlt: true
          }
        }
      }
    });

    if (!programa) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    return NextResponse.json(programa);
  } catch (error) {
    console.error('Error fetching programa:', error);
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
      sectorName,
      description,
      imageUrl,
      imageAlt,
      presentationVideo,
      odsAlignment,
      resultsAreas,
      results,
      targetGroups,
      contentTopics,
      moreInfoLink,
      isActive
    } = body;

    const existing = await prisma.program.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Programa no encontrado' }, { status: 404 });
    }

    if (imageUrl !== undefined && existing.imageUrl && existing.imageUrl !== imageUrl) {
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
      const { bucket, key } = extractBucketAndKey(existing.imageUrl);
      if (bucket && key) {
        try {
          console.log('[Programs][PUT] Eliminando imagen anterior', { bucket, key, id });
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Programs][PUT] No se pudo eliminar imagen anterior', { bucket, key, id, error: String(e) });
        }
      }
    }

    const programa = await prisma.program.update({
      where: { id: id },
      data: {
        sectorName,
        description,
        imageUrl: imageUrl === undefined ? existing.imageUrl : (imageUrl || null),
        imageAlt: imageAlt === undefined ? existing.imageAlt : (imageAlt || null),
        presentationVideo,
        odsAlignment,
        resultsAreas,
        results,
        targetGroups,
        contentTopics,
        moreInfoLink,
        isActive
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json(programa);
  } catch (error) {
    console.error('Error updating programa:', error);
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
    
    const programa = await prisma.program.findUnique({ where: { id } });
    if (!programa) {
      return NextResponse.json({ message: 'Programa eliminado exitosamente' });
    }

    if (programa.imageUrl) {
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
      const { bucket, key } = extractBucketAndKey(programa.imageUrl);
      if (bucket && key) {
        try {
          console.log('[Programs][DELETE] Eliminando imagen', { bucket, key, id });
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Programs][DELETE] No se pudo eliminar imagen', { bucket, key, id, error: String(e) });
        }
      }
    }

    await prisma.program.delete({ where: { id } });
    return NextResponse.json({ message: 'Programa eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting programa:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
