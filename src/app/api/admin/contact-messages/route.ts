import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Listar mensajes de contacto
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isRead = searchParams.get('isRead');
    const limit = searchParams.get('limit');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let messages;
    
    // Si hay filtros de fecha, usar query raw
    if (month || year) {
      const conditions: string[] = [];
      if (isRead !== null && isRead !== undefined) {
        conditions.push(`is_read = ${isRead === 'true'}`);
      }
      if (month) conditions.push(`EXTRACT(MONTH FROM created_at) = ${month}`);
      if (year) conditions.push(`EXTRACT(YEAR FROM created_at) = ${year}`);
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limitClause = limit ? `LIMIT ${parseInt(limit)}` : '';
      
      messages = await (prisma as any).$queryRawUnsafe(
        `SELECT * FROM contact_messages ${whereClause} ORDER BY created_at DESC ${limitClause}`
      );
    } else {
      // Usar Prisma normal para filtros simples
      const where: any = {};
      if (isRead !== null && isRead !== undefined) {
        where.isRead = isRead === 'true';
      }

      messages = await (prisma as any).contactMessage.findMany({
        where,
        take: limit ? parseInt(limit) : undefined,
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Error al obtener mensajes de contacto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
