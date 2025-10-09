import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Primero intentar obtener aliados destacados
    const featuredAllies = await prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        role, 
        description,
        "imageUrl",
        "imageAlt",
        "isActive",
        "isFeatured",
        "createdAt"
      FROM allies 
      WHERE "isActive" = true AND "isFeatured" = true
      ORDER BY "createdAt" DESC
    ` as any[];

    let allies = featuredAllies;

    // Si no hay aliados destacados, mostrar algunos aliados regulares como fallback
    if (featuredAllies.length === 0) {
      const regularAllies = await prisma.$queryRaw`
        SELECT 
          id, 
          name, 
          role, 
          description,
          "imageUrl",
          "imageAlt",
          "isActive",
          "isFeatured",
          "createdAt"
        FROM allies 
        WHERE "isActive" = true
        ORDER BY "createdAt" DESC
        LIMIT 3
      ` as any[];
      allies = regularAllies;
    }

    const formattedAllies = allies.map((ally: any) => ({
      id: ally.id,
      name: ally.name,
      role: ally.role,
      description: ally.description,
      imageUrl: ally.imageUrl,
      imageAlt: ally.imageAlt,
      createdAt: ally.createdAt ? ally.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      author: null // Simplificado por ahora para evitar problemas de tipos
    }));

    return NextResponse.json(formattedAllies);
  } catch (error) {
    console.error('❌ Error al obtener aliados:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
