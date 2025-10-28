import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { fullName, email, phone, experience, driveLink } = body;

    // Validaciones
    if (!fullName || !email || !phone || !experience) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que la convocatoria existe y está activa
    const convocatoria = await prisma.convocatoria.findUnique({
      where: { id },
    });

    if (!convocatoria) {
      return NextResponse.json(
        { error: 'Convocatoria no encontrada' },
        { status: 404 }
      );
    }

    if (!convocatoria.isActive || convocatoria.status === 'DRAFT' || convocatoria.status === 'CLOSED') {
      return NextResponse.json(
        { error: 'Esta convocatoria no está disponible para postulaciones' },
        { status: 400 }
      );
    }

    // Verificar que no haya aplicado antes con el mismo email
    const existingApplication = await prisma.convocatoriaApplication.findFirst({
      where: {
        convocatoriaId: id,
        email: email,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'Ya has aplicado a esta convocatoria con este correo electrónico' },
        { status: 400 }
      );
    }

    // Crear la aplicación
    const application = await prisma.convocatoriaApplication.create({
      data: {
        fullName,
        email,
        phone,
        experience,
        driveLink: driveLink || null,
        convocatoriaId: id,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

