import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storageService } from '@/lib/storage-service';

const prisma = new PrismaClient();

// PATCH - Actualizar estado de denuncia
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validar que el estado sea válido
    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido' },
        { status: 400 }
      );
    }

    const complaint = await (prisma as any).complaint.update({
      where: { id },
      data: {
        status,
        reviewedAt: status !== 'PENDING' ? new Date() : null,
        reviewedBy: status !== 'PENDING' ? session.user.id : null
      },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      complaint
    });
  } catch (error) {
    console.error('Error al actualizar denuncia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar denuncia
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Obtener la denuncia antes de eliminarla para acceder a las evidencias
    const existingComplaint = await (prisma as any).complaint.findUnique({
      where: { id }
    });

    if (!existingComplaint) {
      return NextResponse.json(
        { error: 'Denuncia no encontrada' },
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

    // Eliminar archivos de evidencias del bucket si existen
    if (existingComplaint.evidence) {
      // Parsear URLs del campo evidence (separadas por comas)
      const urlPattern = /https?:\/\/[^\s,]+/g;
      const evidenceUrls = existingComplaint.evidence.match(urlPattern) || [];
      
      // Eliminar cada archivo del bucket
      for (const evidenceUrl of evidenceUrls) {
        const { bucket, key } = extractBucketAndKey(evidenceUrl);
        if (bucket && key) {
          try {
            await storageService.deleteFile(bucket, key);
          } catch (e) {
            console.warn('[Complaints][DELETE] No se pudo eliminar archivo de evidencia del bucket:', evidenceUrl, e);
            // No fallar la eliminación si no se puede borrar del bucket
          }
        }
      }
    }

    // Eliminar la denuncia de la base de datos
    await (prisma as any).complaint.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Denuncia eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar denuncia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
