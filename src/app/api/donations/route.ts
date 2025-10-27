import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Requerir autenticación para crear donaciones desde el CMS
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado. Usa /api/public/donations para donaciones públicas.' },
        { status: 401 }
      );
    }

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
    console.error('Error al crear donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const donationProjectId = searchParams.get('donationProjectId');
    const donationType = searchParams.get('donationType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) {
      where.status = status.toUpperCase();
    }
    if (donationProjectId) {
      where.donationProjectId = donationProjectId;
    }
    if (donationType) {
      where.donationType = donationType.toUpperCase();
    }

    const [donations, total] = await Promise.all([
      prisma.donation.findMany({
        where,
        include: {
          donationProject: true,
          approver: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.donation.count({ where })
    ]);

    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener donaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
