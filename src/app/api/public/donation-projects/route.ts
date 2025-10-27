import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = {
      isActive: true
    };

    if (id) {
      where.id = id;
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    const donationProjects = await prisma.donationProject.findMany({
      where,
      include: {
        donations: {
          where: {
            status: 'APPROVED'
          },
          select: {
            amount: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    // Calcular estadísticas de cada proyecto
    const projectsWithStats = donationProjects.map(project => {
      const totalDonated = project.donations.reduce((sum, donation) => sum + Number(donation.amount), 0);
      const progressPercentage = project.targetAmount 
        ? Math.min((totalDonated / Number(project.targetAmount)) * 100, 100)
        : 0;

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        context: project.context,
        objectives: project.objectives,
        executionStart: project.executionStart,
        executionEnd: project.executionEnd,
        accountNumber: project.accountNumber,
        recipientName: project.recipientName,
        qrImageUrl: project.qrImageUrl,
        qrImageAlt: project.qrImageAlt,
        referenceImageUrl: project.referenceImageUrl,
        referenceImageAlt: project.referenceImageAlt,
        targetAmount: project.targetAmount,
        currentAmount: totalDonated,
        progressPercentage: Math.round(progressPercentage * 100) / 100,
        isCompleted: project.isCompleted,
        isFeatured: project.isFeatured,
        donationCount: project.donations.length
      };
    });

    return NextResponse.json(projectsWithStats);

  } catch (error) {
    console.error('Error al obtener proyectos de donación públicos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
