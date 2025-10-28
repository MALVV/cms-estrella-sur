import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Requerir autenticación de ADMINISTRATOR
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      context,
      objectives,
      executionStart,
      executionEnd,
      accountNumber,
      recipientName,
      qrImageUrl,
      qrImageAlt,
      referenceImageUrl,
      referenceImageAlt,
      targetAmount,
      isActive,
      isFeatured
    } = body;

    // Validar campos requeridos
    if (!title || !description || !context || !objectives || !accountNumber || !recipientName) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, description, context, objectives, accountNumber, recipientName' },
        { status: 400 }
      );
    }

    // Crear el proyecto de donación
    const donationProject = await prisma.donationProject.create({
      data: {
        title,
        description,
        context,
        objectives,
        executionStart: new Date(executionStart),
        executionEnd: new Date(executionEnd),
        accountNumber,
        recipientName,
        qrImageUrl: qrImageUrl || null,
        qrImageAlt: qrImageAlt || null,
        referenceImageUrl: referenceImageUrl || null,
        referenceImageAlt: referenceImageAlt || null,
        targetAmount: targetAmount ? parseFloat(targetAmount) : null,
        currentAmount: 0,
        isActive: isActive !== undefined ? isActive : true,
        isCompleted: false,
        isFeatured: isFeatured !== undefined ? isFeatured : false
      }
    });

    return NextResponse.json({
      success: true,
      donationProject
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear proyecto de donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) where.isActive = isActive === 'true';

    const donationProjects = await prisma.donationProject.findMany({
      where,
      include: {
        donations: {
          where: {
            status: 'APPROVED'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(donationProjects);

  } catch (error) {
    console.error('Error al obtener proyectos de donación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
