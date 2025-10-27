import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      donorName,
      donorEmail,
      donorAddress,
      donorPhone,
      amount,
      donationType,
      message,
      donationProjectId
    } = body;

    // Validar campos requeridos
    if (!donorName || !donorEmail || !donorAddress || !donorPhone || !amount || !donationType) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar que el tipo de donación sea válido
    const validDonationTypes = ['GENERAL', 'EMERGENCY', 'SPECIFIC_PROJECT', 'MONTHLY'];
    if (!validDonationTypes.includes(donationType.toUpperCase())) {
      return NextResponse.json(
        { error: 'Tipo de donación inválido' },
        { status: 400 }
      );
    }

    // Si es una donación específica, verificar que el proyecto existe
    if (donationProjectId) {
      const project = await prisma.donationProject.findUnique({
        where: { id: donationProjectId }
      });

      if (!project) {
        return NextResponse.json(
          { error: 'Proyecto de donación no encontrado' },
          { status: 404 }
        );
      }

      if (!project.isActive) {
        return NextResponse.json(
          { error: 'El proyecto de donación no está activo' },
          { status: 400 }
        );
      }
    }

    // Crear la donación
    const donation = await prisma.donation.create({
      data: {
        donorName,
        donorEmail,
        donorAddress,
        donorPhone,
        amount: parseFloat(amount),
        donationType: donationType.toUpperCase(),
        message: message || null,
        donationProjectId: donationProjectId || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      donation: {
        id: donation.id,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        amount: donation.amount,
        donationType: donation.donationType,
        status: donation.status,
        createdAt: donation.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear donación pública:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}


