import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { storageService } from '@/lib/storage-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const ally = await prisma.ally.findUnique({
      where: { id: resolvedParams.id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!ally) {
      return NextResponse.json({ error: 'Aliado no encontrado' }, { status: 404 })
    }

    const formattedAlly = {
      id: ally.id,
      name: ally.name,
      role: ally.role,
      description: ally.description,
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      status: ally.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: ally.isFeatured || false,
      createdAt: ally.createdAt.toISOString().split('T')[0],
      updatedAt: ally.updatedAt.toISOString().split('T')[0],
      createdBy: ally.createdBy,
      author: ally.creator ? {
        id: ally.creator.id,
        name: ally.creator.name,
        email: ally.creator.email,
        role: ally.creator.role
      } : null
    }

    return NextResponse.json(formattedAlly)
  } catch (error) {
    console.error('Error al obtener aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { name, role, description, imageUrl, imageAlt, isActive, isFeatured } = body

    if (!name || !role) {
      return NextResponse.json(
        { error: 'Nombre y rol son requeridos' },
        { status: 400 }
      )
    }

    const existing = await prisma.ally.findUnique({ where: { id: resolvedParams.id } });
    if (!existing) {
      return NextResponse.json({ error: 'Aliado no encontrado' }, { status: 404 });
    }

    // Helper para normalizar URLs
    const normalizeImageUrlForSave = (url: string | null | undefined): string | null => {
      if (url === undefined) return existing.imageUrl;
      if (!url || url.trim() === '' || url === 'null') return null;
      return url.trim();
    };

    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url.trim() === '' || url === 'null') return null;
      return url.trim();
    };

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

    // Helper para normalizar imageAlt
    const normalizeImageAltForSave = (alt: string | null | undefined): string | null => {
      if (alt === undefined) return existing.imageAlt;
      if (!alt || alt.trim() === '' || alt === 'null') return null;
      return alt.trim();
    };

    // Determinar si necesitamos eliminar la imagen anterior
    const finalImageUrl = normalizeImageUrlForSave(imageUrl);
    const finalImageAlt = normalizeImageAltForSave(imageAlt);
    const oldImageUrl = normalizeImageUrl(existing.imageUrl);
    const shouldDeleteOldImage = oldImageUrl && (
      (finalImageUrl && oldImageUrl !== finalImageUrl) || // Reemplazo
      (finalImageUrl === null && oldImageUrl !== null)    // Eliminación explícita
    );

    if (shouldDeleteOldImage && oldImageUrl) {
      const { bucket, key } = extractBucketAndKey(oldImageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Allies][PUT] No se pudo eliminar imagen anterior', { bucket, key, id: resolvedParams.id, error: String(e) });
        }
      }
    }

    // Si finalImageUrl es null explícitamente (eliminación), usar cadena vacía en lugar de placeholder
    // Si es undefined, no actualizar el campo
    const imageUrlToSave = imageUrl === undefined 
      ? existing.imageUrl 
      : (finalImageUrl !== null 
          ? finalImageUrl 
          : (existing.imageUrl && existing.imageUrl !== '/placeholder-ally.jpg' 
              ? existing.imageUrl 
              : ''));

    const imageAltToSave = imageAlt === undefined
      ? existing.imageAlt
      : (finalImageAlt !== null ? finalImageAlt : (existing.imageAlt || name));

    const updatedAlly = await prisma.ally.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        role,
        description: description || '',
        imageUrl: imageUrlToSave,
        imageAlt: imageAltToSave,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured !== undefined ? isFeatured : false
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    const formattedAlly = {
      id: updatedAlly.id,
      name: updatedAlly.name,
      role: updatedAlly.role,
      description: updatedAlly.description,
      imageUrl: updatedAlly.imageUrl,
      imageAlt: updatedAlly.imageAlt,
      status: updatedAlly.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: updatedAlly.isFeatured || false,
      createdAt: updatedAlly.createdAt.toISOString().split('T')[0],
      updatedAt: updatedAlly.updatedAt.toISOString().split('T')[0],
      createdBy: updatedAlly.createdBy,
      author: updatedAlly.creator ? {
        id: updatedAlly.creator.id,
        name: updatedAlly.creator.name,
        email: updatedAlly.creator.email,
        role: updatedAlly.creator.role
      } : null
    }

    return NextResponse.json(formattedAlly)
  } catch (error) {
    console.error('Error al actualizar aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'El campo isActive es requerido y debe ser booleano' },
        { status: 400 }
      )
    }

    const updatedAlly = await prisma.ally.update({
      where: { id: resolvedParams.id },
      data: { isActive },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    const formattedAlly = {
      id: updatedAlly.id,
      name: updatedAlly.name,
      role: updatedAlly.role,
      description: updatedAlly.description,
      imageUrl: updatedAlly.imageUrl,
      imageAlt: updatedAlly.imageAlt,
      status: updatedAlly.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: updatedAlly.isFeatured || false,
      createdAt: updatedAlly.createdAt.toISOString().split('T')[0],
      updatedAt: updatedAlly.updatedAt.toISOString().split('T')[0],
      createdBy: updatedAlly.createdBy,
      author: updatedAlly.creator ? {
        id: updatedAlly.creator.id,
        name: updatedAlly.creator.name,
        email: updatedAlly.creator.email,
        role: updatedAlly.creator.role
      } : null
    }

    return NextResponse.json(formattedAlly)
  } catch (error) {
    console.error('Error al cambiar estado del aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const resolvedParams = await params;
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const ally = await prisma.ally.findUnique({ where: { id: resolvedParams.id } });
    
    if (ally?.imageUrl) {
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
      const { bucket, key } = extractBucketAndKey(ally.imageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Allies][DELETE] No se pudo eliminar imagen', { bucket, key, id: resolvedParams.id, error: String(e) });
        }
      }
    }

    await prisma.ally.delete({
      where: { id: resolvedParams.id }
    })

    return NextResponse.json({ message: 'Aliado eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar aliado:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
