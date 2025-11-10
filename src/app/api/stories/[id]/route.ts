import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { storageService } from '@/lib/storage-service'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = await params;
    const { id } = resolvedParams

    // Verificar que la story existe
    const existingStory = await prisma.story.findUnique({
      where: { id }
    })

    if (!existingStory) {
      return NextResponse.json({ message: 'Story eliminada exitosamente' });
    }

    // Eliminar imagen del bucket si existe (y no es placeholder)
    if (existingStory.imageUrl && existingStory.imageUrl !== '/placeholder-story.jpg') {
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
      const { bucket, key } = extractBucketAndKey(existingStory.imageUrl);
      if (bucket && key) {
        try {
          console.log('[Stories][DELETE] Eliminando imagen', { bucket, key, id });
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Stories][DELETE] No se pudo eliminar imagen', { bucket, key, id, error: String(e) });
        }
      }
    }

    // Eliminar la story
    await prisma.story.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Story eliminada exitosamente'
    })
  } catch (error) {
    console.error('Error al eliminar story:', error)
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
    
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const resolvedParams = await params;
    const { id } = resolvedParams
    const body = await request.json()
    const { title, content, imageUrl, imageAlt, isActive } = body

    // Verificar que la story existe
    const existingStory = await prisma.story.findUnique({
      where: { id }
    })

    if (!existingStory) {
      return NextResponse.json(
        { error: 'Story no encontrada' },
        { status: 404 }
      )
    }

    // Validar datos requeridos
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Título y contenido son requeridos' },
        { status: 400 }
      )
    }

    // Solo eliminar imagen anterior si se está reemplazando con una nueva (no si se está eliminando)
    // La eliminación del bucket se maneja en el frontend antes de enviar la solicitud
    if (imageUrl !== undefined && existingStory.imageUrl && existingStory.imageUrl !== imageUrl && imageUrl && imageUrl !== null) {
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
      const { bucket, key } = extractBucketAndKey(existingStory.imageUrl);
      if (bucket && key) {
        try {
          console.log('[Stories][PUT] Eliminando imagen anterior', { bucket, key, id });
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Stories][PUT] No se pudo eliminar imagen anterior', { bucket, key, id, error: String(e) });
        }
      }
    }

    // Función helper para normalizar imageUrl antes de guardar
    const normalizeImageUrlForSave = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-story.jpg' || (typeof url === 'string' && url.trim() === '')) {
        return null;
      }
      return url;
    };

    // Actualizar la story
    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl: imageUrl !== undefined ? normalizeImageUrlForSave(imageUrl) : normalizeImageUrlForSave(existingStory.imageUrl),
        imageAlt: imageAlt !== undefined ? (imageAlt || null) : existingStory.imageAlt,
        isActive: isActive !== undefined ? isActive : existingStory.isActive
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

    // Función helper para normalizar imageUrl
    const normalizeImageUrl = (url: string | null | undefined): string | null => {
      if (!url || url === '/placeholder-story.jpg' || url.trim() === '') {
        return null;
      }
      return url;
    };

    const formattedStory = {
      id: updatedStory.id,
      title: updatedStory.title,
      content: updatedStory.content,
      imageUrl: normalizeImageUrl(updatedStory.imageUrl),
      imageAlt: updatedStory.imageAlt || null,
      status: updatedStory.isActive ? 'ACTIVE' : 'INACTIVE',
      createdAt: updatedStory.createdAt.toISOString().split('T')[0],
      updatedAt: updatedStory.updatedAt.toISOString().split('T')[0],
      createdBy: updatedStory.createdBy,
      author: updatedStory.creator ? {
        id: updatedStory.creator.id,
        name: updatedStory.creator.name,
        email: updatedStory.creator.email,
        role: updatedStory.creator.role
      } : null
    }

    return NextResponse.json(formattedStory)
  } catch (error) {
    console.error('Error al actualizar story:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
