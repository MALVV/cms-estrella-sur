import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      complaintType,
      description,
      incidentDate,
      incidentLocation,
      peopleInvolved,
      evidence,
      contactName,
      contactEmail
    } = body;

    // Validar campos requeridos
    if (!complaintType || !description) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (complaintType, description)' },
        { status: 400 }
      );
    }

    // Validar que el tipo de denuncia sea válido
    const validComplaintTypes = ['maltrato', 'corrupcion', 'discriminacion', 'acoso', 'negligencia', 'violencia', 'otro'];
    if (!validComplaintTypes.includes(complaintType)) {
      return NextResponse.json(
        { error: 'Tipo de denuncia inválido' },
        { status: 400 }
      );
    }

    // Si se proporciona email de contacto, validar formato
    if (contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail)) {
        return NextResponse.json(
          { error: 'Formato de email inválido' },
          { status: 400 }
        );
      }
    }

    // Crear la denuncia
    const complaint = await prisma.complaint.create({
      data: {
        complaintType,
        description,
        incidentDate: incidentDate || null,
        incidentLocation: incidentLocation || null,
        peopleInvolved: peopleInvolved || null,
        evidence: evidence || null,
        contactName: contactName || null,
        contactEmail: contactEmail || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Denuncia enviada de forma segura. Nuestro equipo de salvaguarda la revisará siguiendo nuestros protocolos establecidos.',
      complaint: {
        id: complaint.id,
        complaintType: complaint.complaintType,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear denuncia:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

