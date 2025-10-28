import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      email,
      phone,
      age,
      occupation,
      areaOfInterest,
      availability,
      motivation,
      experience,
      driveLink,
      documents
    } = body;

    // Validaciones básicas
    if (!fullName || !email || !phone || !age || !occupation || !areaOfInterest || !availability || !motivation) {
      return NextResponse.json(
        { error: 'Todos los campos marcados con * son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que no haya aplicado antes con el mismo email
    const existingApplication = await prisma.volunteerApplication.findFirst({
      where: {
        email: email,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (existingApplication) {
      const timeSinceLastApplication = Date.now() - existingApplication.createdAt.getTime();
      const daysSinceLastApplication = timeSinceLastApplication / (1000 * 60 * 60 * 24);
      
      // Si han pasado menos de 30 días desde la última aplicación
      if (daysSinceLastApplication < 30) {
        return NextResponse.json(
          { error: 'Ya has enviado una aplicación recientemente. Por favor espera al menos 30 días antes de volver a aplicar.' },
          { status: 400 }
        );
      }
    }

    // Crear la aplicación
    const application = await prisma.volunteerApplication.create({
      data: {
        fullName,
        email,
        phone,
        age,
        occupation,
        areaOfInterest,
        availability,
        motivation,
        experience: experience || null,
        driveLink: driveLink || null,
        documents: documents || null,
        status: 'PENDING'
      },
    });

    return NextResponse.json(
      { 
        success: true,
        message: 'Tu solicitud de voluntariado ha sido enviada exitosamente',
        application 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating volunteer application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

