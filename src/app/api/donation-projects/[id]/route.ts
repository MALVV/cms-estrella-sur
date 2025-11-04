import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { storageService } from '@/lib/storage-service';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await request.json();
    const { isActive } = body;

    // Verificar que el proyecto de donación existe
    const existingDonationProject = await prisma.donationProject.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingDonationProject) {
      return NextResponse.json(
        { error: 'Proyecto de donación no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar solo el estado activo
    const updatedDonationProject = await prisma.donationProject.update({
      where: { id: resolvedParams.id },
      data: {
        isActive: isActive
      }
    });

    return NextResponse.json({
      success: true,
      donationProject: updatedDonationProject
    });

  } catch (error) {
    console.error('Error al actualizar estado del proyecto de donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const body = await request.json();
    const {
      accountNumber,
      recipientName,
      qrImageUrl,
      qrImageAlt,
      referenceImageUrl,
      referenceImageAlt,
      targetAmount,
      isActive
    } = body;

    // Verificar que el proyecto de donación existe
    const existingDonationProject = await prisma.donationProject.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingDonationProject) {
      return NextResponse.json(
        { error: 'Proyecto de donación no encontrado' },
        { status: 404 }
      );
    }

    // Helper para normalizar URLs
    const normalizeUrl = (url: string | null | undefined): string | null => {
      if (!url || url.trim() === '' || url === 'null') return null;
      return url;
    };

    // Helper para extraer bucket y key
    const extractBucketAndKey = (u: string): { bucket: string | null; key: string | null } => {
      try {
        if (!u) return { bucket: null, key: null };
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

    const oldQrImageUrl = existingDonationProject.qrImageUrl;
    const oldReferenceImageUrl = existingDonationProject.referenceImageUrl;
    const finalQrImageUrl = normalizeUrl(qrImageUrl);
    const finalReferenceImageUrl = normalizeUrl(referenceImageUrl);

    // Eliminar QR anterior del bucket si se reemplazó o se eliminó
    const shouldDeleteOldQr = oldQrImageUrl && 
      (finalQrImageUrl !== oldQrImageUrl || finalQrImageUrl === null);
    
    if (shouldDeleteOldQr) {
      const { bucket, key } = extractBucketAndKey(oldQrImageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[DonationProjects][PATCH] No se pudo eliminar QR del bucket:', e);
        }
      }
    }

    // Eliminar imagen de referencia anterior del bucket si se reemplazó o se eliminó
    const shouldDeleteOldReference = oldReferenceImageUrl && 
      (finalReferenceImageUrl !== oldReferenceImageUrl || finalReferenceImageUrl === null);
    
    if (shouldDeleteOldReference) {
      const { bucket, key } = extractBucketAndKey(oldReferenceImageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[DonationProjects][PATCH] No se pudo eliminar imagen de referencia del bucket:', e);
        }
      }
    }

    // Actualizar el proyecto de donación
    const updatedDonationProject = await prisma.donationProject.update({
      where: { id: resolvedParams.id },
      data: {
        accountNumber: accountNumber !== undefined ? accountNumber : existingDonationProject.accountNumber,
        recipientName: recipientName !== undefined ? recipientName : existingDonationProject.recipientName,
        qrImageUrl: qrImageUrl !== undefined ? finalQrImageUrl : existingDonationProject.qrImageUrl,
        qrImageAlt: qrImageAlt !== undefined ? qrImageAlt : existingDonationProject.qrImageAlt,
        referenceImageUrl: referenceImageUrl !== undefined ? finalReferenceImageUrl : existingDonationProject.referenceImageUrl,
        referenceImageAlt: referenceImageAlt !== undefined ? referenceImageAlt : existingDonationProject.referenceImageAlt,
        targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : existingDonationProject.targetAmount,
        isActive: isActive !== undefined ? isActive : existingDonationProject.isActive
      },
      include: {
        donations: {
          where: {
            status: 'APPROVED'
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      donationProject: updatedDonationProject
    });

  } catch (error) {
    console.error('Error al actualizar proyecto de donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const donationProject = await prisma.donationProject.findUnique({
      where: { id: resolvedParams.id },
      include: {
        donations: {
          where: {
            status: 'APPROVED'
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!donationProject) {
      return NextResponse.json(
        { error: 'Proyecto de donación no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(donationProject);

  } catch (error) {
    console.error('Error al obtener proyecto de donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;

    // Verificar que el proyecto de donación existe
    const existingDonationProject = await prisma.donationProject.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingDonationProject) {
      return NextResponse.json(
        { error: 'Proyecto de donación no encontrado' },
        { status: 404 }
      );
    }

    // Helper para extraer bucket y key
    const extractBucketAndKey = (u: string): { bucket: string | null; key: string | null } => {
      try {
        if (!u) return { bucket: null, key: null };
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

    // Eliminar QR del bucket si existe (no crítico si falla)
    if (existingDonationProject.qrImageUrl) {
      const { bucket, key } = extractBucketAndKey(existingDonationProject.qrImageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[DonationProjects][DELETE] No se pudo eliminar QR del bucket:', e);
          // No fallar la eliminación si no se puede borrar del bucket
        }
      }
    }

    // Eliminar imagen de referencia del bucket si existe (no crítico si falla)
    if (existingDonationProject.referenceImageUrl) {
      const { bucket, key } = extractBucketAndKey(existingDonationProject.referenceImageUrl);
      if (bucket && key) {
        try {
          await storageService.deleteFile(bucket, key);
        } catch (e) {
          console.warn('[DonationProjects][DELETE] No se pudo eliminar imagen de referencia del bucket:', e);
          // No fallar la eliminación si no se puede borrar del bucket
        }
      }
    }

    // Eliminar el proyecto de donación (esto también eliminará las donaciones relacionadas por CASCADE)
    await prisma.donationProject.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Proyecto de donación eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar proyecto de donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
