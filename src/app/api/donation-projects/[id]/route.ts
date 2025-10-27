import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

    // Actualizar el proyecto de donación
    const updatedDonationProject = await prisma.donationProject.update({
      where: { id: resolvedParams.id },
      data: {
        accountNumber: accountNumber || existingDonationProject.accountNumber,
        recipientName: recipientName || existingDonationProject.recipientName,
        qrImageUrl: qrImageUrl !== undefined ? qrImageUrl : existingDonationProject.qrImageUrl,
        qrImageAlt: qrImageAlt !== undefined ? qrImageAlt : existingDonationProject.qrImageAlt,
        referenceImageUrl: referenceImageUrl !== undefined ? referenceImageUrl : existingDonationProject.referenceImageUrl,
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
