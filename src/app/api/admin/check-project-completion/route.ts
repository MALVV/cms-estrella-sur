import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkAllProjectsCompletion } from '@/lib/donation-utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    // Solo ADMINISTRATORes pueden ejecutar esta verificación
    if (session.user.role !== 'ADMINISTRATOR') {
      return NextResponse.json(
        { error: 'Solo ADMINISTRATORes pueden ejecutar esta acción' },
        { status: 403 }
      );
    }

    const completedCount = await checkAllProjectsCompletion();

    return NextResponse.json({
      success: true,
      message: `Verificación completada. ${completedCount} proyectos marcados como completados.`,
      completedCount
    });

  } catch (error) {
    console.error('Error al verificar proyectos completados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
