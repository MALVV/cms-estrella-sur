import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔍 Toggle featured API called');
    
    const session = await getServerSession(authOptions);
    console.log('🔍 Session:', { hasSession: !!session, hasUser: !!session?.user });
    
    if (!session?.user) {
      console.log('❌ No session found');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const body = await request.json();
    const { isFeatured } = body;

    console.log('🔍 Request data:', { id, isFeatured, bodyType: typeof isFeatured });

    if (typeof isFeatured !== 'boolean') {
      console.log('❌ Invalid isFeatured type:', typeof isFeatured);
      return NextResponse.json(
        { error: 'El campo isFeatured es requerido y debe ser booleano' },
        { status: 400 }
      );
    }

    console.log('🔍 Looking for ally with id:', id);
    
    // Usar consulta SQL raw para evitar problemas de tipos
    const existingAlly = await prisma.$queryRaw`
      SELECT id, name, role, description, "imageUrl", "imageAlt", "isActive", "isFeatured", "createdAt", "updatedAt", "createdBy"
      FROM allies 
      WHERE id = ${id}
    ` as any[];

    if (!existingAlly || existingAlly.length === 0) {
      console.log('❌ Ally not found:', id);
      return NextResponse.json({ error: 'Aliado no encontrado' }, { status: 404 });
    }

    const ally = existingAlly[0];
    console.log('🔍 Found ally:', { id: ally.id, name: ally.name, currentFeatured: ally.isFeatured });

    // Si se está intentando marcar como destacado, verificar el límite
    if (isFeatured && !ally.isFeatured) {
      const featuredCount = await prisma.$queryRaw`
        SELECT COUNT(*) as count
        FROM allies 
        WHERE "isFeatured" = true AND "isActive" = true
      ` as any[];

      const currentFeaturedCount = parseInt(featuredCount[0].count);
      console.log('🔍 Current featured count:', currentFeaturedCount);

      if (currentFeaturedCount >= 3) {
        console.log('❌ Featured limit reached (3)');
        return NextResponse.json(
          { 
            error: 'Límite de destacados alcanzado (3/3). Desmarca otro aliado destacado primero para poder destacar este aliado.',
            code: 'FEATURED_LIMIT_REACHED',
            currentCount: currentFeaturedCount,
            maxCount: 3
          },
          { status: 400 }
        );
      }
    }

    // Actualizar usando SQL raw
    await prisma.$executeRaw`
      UPDATE allies 
      SET "isFeatured" = ${isFeatured}, "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    console.log('✅ Ally updated successfully');

    // Obtener el aliado actualizado
    const updatedAlly = await prisma.$queryRaw`
      SELECT id, name, role, description, "imageUrl", "imageAlt", "isActive", "isFeatured", "createdAt", "updatedAt", "createdBy"
      FROM allies 
      WHERE id = ${id}
    ` as any[];

    const allyData = updatedAlly[0];

    const formattedAlly = {
      id: allyData.id,
      name: allyData.name,
      role: allyData.role,
      description: allyData.description,
      imageUrl: allyData.imageUrl,
      imageAlt: allyData.imageAlt,
      status: allyData.isActive ? 'ACTIVE' : 'INACTIVE',
      isFeatured: allyData.isFeatured,
      createdAt: allyData.createdAt.toISOString().split('T')[0],
      updatedAt: allyData.updatedAt.toISOString().split('T')[0],
      createdBy: allyData.createdBy,
      author: null // Simplificado por ahora
    };

    console.log('✅ Returning formatted ally:', formattedAlly);
    return NextResponse.json(formattedAlly);
  } catch (error) {
    console.error('❌ Error toggling ally featured status:', error);
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
