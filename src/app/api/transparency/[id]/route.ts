import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/simple-auth-middleware';

// GET - Obtener un documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const document = await prisma.transparencyDocument.findUnique({
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

    if (!document) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Verificar si el documento está activo (para usuarios no autenticados)
    const authResult = await verifyAuth(request);
    if (!authResult.isAuthenticated && !document.isActive) {
      return NextResponse.json(
        { error: 'Documento no disponible' },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching transparency document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un documento específico
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

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      description,
      fileName,
      fileUrl,
      category,
      isActive,
      isFeatured,
    } = body;

    // Verificar que el documento existe
    const existingDocument = await prisma.transparencyDocument.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    // Validar que la categoría sea válida si se proporciona
    if (category) {
      const validCategories = ['ACCOUNTABILITY', 'ANNUAL_REPORTS', 'AUDIT_REPORTS'];
      if (!validCategories.includes(category)) {
        return NextResponse.json(
          { error: 'Categoría inválida' },
          { status: 400 }
        );
      }
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

    const oldFileUrl = existingDocument.fileUrl;
    const finalFileUrl = fileUrl || existingDocument.fileUrl;

    // Eliminar archivo anterior del bucket si se reemplazó o se eliminó
    const shouldDeleteOldFile = oldFileUrl && finalFileUrl !== oldFileUrl;
    if (shouldDeleteOldFile && oldFileUrl) {
      const { storageService } = await import('@/lib/storage-service');
      const { bucket, key } = extractBucketAndKey(oldFileUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Transparency][PUT] No se pudo eliminar archivo del bucket:', e);
        }
      }
    }

    const document = await prisma.transparencyDocument.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(fileName && { fileName }),
        ...(fileUrl !== undefined && { fileUrl: fileUrl || null }),
        ...(category && { category }),
        ...(isActive !== undefined && { isActive }),
        ...(isFeatured !== undefined && { isFeatured }),
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

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error updating transparency document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un documento específico
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

    const { id } = await params;

    // Verificar que el documento existe
    const existingDocument = await prisma.transparencyDocument.findUnique({
      where: { id },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
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

    // Eliminar archivo del bucket si existe (no crítico si falla)
    if (existingDocument.fileUrl) {
      const { storageService } = await import('@/lib/storage-service');
      const { bucket, key } = extractBucketAndKey(existingDocument.fileUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[Transparency][DELETE] No se pudo eliminar archivo del bucket:', e);
          // No fallar la eliminación si no se puede borrar del bucket
        }
      }
    }

    await prisma.transparencyDocument.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Documento eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting transparency document:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
