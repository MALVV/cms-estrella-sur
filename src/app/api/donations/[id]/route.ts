import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkAndUpdateProjectCompletion } from '@/lib/donation-utils';
import { updateAnnualGoalAmount } from '@/lib/annual-goal-utils';
import { storageService } from '@/lib/storage-service';

const prisma = new PrismaClient();

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Debug: verificar el contenido de la sesión
    console.log('Session user:', session.user);
    console.log('Session user id:', session.user.id);

    if (!session.user.id) {
      return NextResponse.json(
        { error: 'ID de usuario no encontrado en la sesión' },
        { status: 400 }
      );
    }

    // Manejar tanto JSON como FormData
    let donationId, status, bankTransferImage, bankTransferImageAlt;
    
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('multipart/form-data')) {
      // Manejar FormData
      const formData = await request.formData();
      donationId = formData.get('donationId') as string;
      status = formData.get('status') as string;
      
      // Manejar archivo de comprobante
      const file = formData.get('bankTransferImage') as File;
      if (file && file.size > 0) {
        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
          return NextResponse.json(
            { error: 'Solo se permiten archivos de imagen' },
            { status: 400 }
          );
        }

        // Validar tamaño del archivo (máximo 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          return NextResponse.json(
            { error: 'El archivo es demasiado grande. Máximo 10MB' },
            { status: 400 }
          );
        }

        // Convertir archivo a buffer y subirlo
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const uploadResult = await storageService.uploadFile(
          buffer,
          file.name,
          {
            bucket: process.env.AWS_S3_BUCKET || process.env.AWS_BUCKET,
            isPublic: true,
            contentType: file.type,
            prefix: 'donation-proofs/'
          }
        );
        
        bankTransferImage = uploadResult.url;
        bankTransferImageAlt = file.name;
      }
    } else {
      // Manejar JSON
      const body = await request.json();
      ({ donationId, status, bankTransferImage, bankTransferImageAlt } = body);
    }

    if (!donationId || !status) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: donationId, status' },
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED', 'CANCELLED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Estado inválido. Debe ser APPROVED, REJECTED, CANCELLED o PENDING' },
        { status: 400 }
      );
    }

    // Verificar que el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado en la base de datos' },
        { status: 400 }
      );
    }

    // Verificar que la donación existe
    const existingDonation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donationProject: true
      }
    });

    if (!existingDonation) {
      return NextResponse.json(
        { error: 'Donación no encontrada' },
        { status: 404 }
      );
    }

    // Si la donación está actualmente aprobada y se va a cambiar a otro estado, revertir el monto
    if (existingDonation.status === 'APPROVED' && existingDonation.donationProject && status !== 'APPROVED') {
      await prisma.donationProject.update({
        where: { id: existingDonation.donationProject.id },
        data: {
          currentAmount: {
            decrement: existingDonation.amount
          }
        }
      });

      // Verificar si el proyecto sigue completado
      await checkAndUpdateProjectCompletion(existingDonation.donationProject.id);
    }

    // Actualizar la donación PRIMERO
    const updatedDonation = await prisma.donation.update({
      where: { id: donationId },
      data: {
        status,
        approvedBy: status === 'APPROVED' ? session.user.id : existingDonation.approvedBy,
        approvedAt: status === 'APPROVED' ? new Date() : existingDonation.approvedAt,
        bankTransferImage: bankTransferImage || existingDonation.bankTransferImage,
        bankTransferImageAlt: bankTransferImageAlt || existingDonation.bankTransferImageAlt
      },
      include: {
        donationProject: true,
        approver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Si la donación fue aprobada y no estaba aprobada antes, actualizar el monto actual del proyecto
    if (status === 'APPROVED' && existingDonation.status !== 'APPROVED' && existingDonation.donationProject) {
      await prisma.donationProject.update({
        where: { id: existingDonation.donationProject.id },
        data: {
          currentAmount: {
            increment: existingDonation.amount
          }
        }
      });

      // Verificar automáticamente si se alcanzó la meta y marcar como completado
      await checkAndUpdateProjectCompletion(existingDonation.donationProject.id);
    }

    // Actualizar la meta anual DESPUÉS de actualizar la donación (para que el status ya esté actualizado en la BD)
    await updateAnnualGoalAmount();

    return NextResponse.json({
      success: true,
      donation: updatedDonation
    });

  } catch (error) {
    console.error('Error al actualizar donación:', error);
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
    const donationId = resolvedParams.id;

    if (!donationId) {
      return NextResponse.json(
        { error: 'ID de donación requerido' },
        { status: 400 }
      );
    }

    // Verificar que la donación existe
    const existingDonation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donationProject: true
      }
    });

    if (!existingDonation) {
      return NextResponse.json(
        { error: 'Donación no encontrada' },
        { status: 404 }
      );
    }

    // Si la donación está aprobada y está asociada a un proyecto, revertir el monto
    if (existingDonation.status === 'APPROVED' && existingDonation.donationProject) {
      const updatedProject = await prisma.donationProject.update({
        where: { id: existingDonation.donationProject.id },
        data: {
          currentAmount: {
            decrement: existingDonation.amount
          }
        }
      });

      // Verificar si el proyecto sigue completado
      const wasCompleted = await checkAndUpdateProjectCompletion(existingDonation.donationProject.id);
      
      // Actualizar la meta anual
      await updateAnnualGoalAmount();
    }

    // Eliminar la donación
    await prisma.donation.delete({
      where: { id: donationId }
    });

    return NextResponse.json({
      success: true,
      message: 'Donación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const resolvedParams = await params;
    const donationId = resolvedParams.id;

    if (!donationId) {
      return NextResponse.json(
        { error: 'ID de donación requerido' },
        { status: 400 }
      );
    }

    const donation = await prisma.donation.findUnique({
      where: { id: donationId },
      include: {
        donationProject: true,
        approver: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!donation) {
      return NextResponse.json(
        { error: 'Donación no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(donation);

  } catch (error) {
    console.error('Error al obtener donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
