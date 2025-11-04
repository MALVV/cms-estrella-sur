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
      documents,
      documentUrls
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
      
      // Si han pasado menos de 1 día desde la última aplicación
      if (daysSinceLastApplication < 1) {
        return NextResponse.json(
          { error: 'Ya has enviado una aplicación recientemente. Por favor espera al menos 1 día antes de volver a aplicar.' },
          { status: 400 }
        );
      }
    }

    // Determinar qué usar: documentos subidos o driveLink/documents proporcionados
    // Si hay documentUrls, las guardamos en documents separadas por comas
    // Si no, usamos documents o driveLink proporcionados
    const finalDocuments = documentUrls && Array.isArray(documentUrls) && documentUrls.length > 0
      ? documentUrls.join(',')
      : (documents || null);
    
    const finalDriveLink = driveLink || null;

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
        driveLink: finalDriveLink,
        documents: finalDocuments,
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

