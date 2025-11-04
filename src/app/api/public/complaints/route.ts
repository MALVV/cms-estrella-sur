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
      contactEmail,
      documentUrls
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
    if (contactEmail && contactEmail.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactEmail.trim())) {
        return NextResponse.json(
          { error: 'Formato de email inválido' },
          { status: 400 }
        );
      }
    }

    // Determinar qué usar: documentos subidos o evidence proporcionado
    // Si hay documentUrls, las guardamos en evidence separadas por comas
    // Si no, usamos el evidence proporcionado
    const finalEvidence = documentUrls && Array.isArray(documentUrls) && documentUrls.length > 0
      ? documentUrls.join(',')
      : (evidence || null);

    // Crear la denuncia
    const complaint = await prisma.complaint.create({
      data: {
        complaintType,
        description,
        incidentDate: incidentDate || null,
        incidentLocation: incidentLocation || null,
        peopleInvolved: peopleInvolved || null,
        evidence: finalEvidence,
        contactName: contactName && contactName.trim() !== '' ? contactName.trim() : null,
        contactEmail: contactEmail && contactEmail.trim() !== '' ? contactEmail.trim() : null,
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

