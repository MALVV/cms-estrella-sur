import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      message
    } = body;

    // Validar campos requeridos
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos (name, email, message)' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Crear el mensaje de contacto
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        message
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Mensaje de contacto enviado correctamente',
      contactMessage: {
        id: contactMessage.id,
        name: contactMessage.name,
        email: contactMessage.email,
        createdAt: contactMessage.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error al crear mensaje de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

