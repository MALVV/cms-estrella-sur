import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

// GET - Listar denuncias
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
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    let complaints;
    
    // Si hay filtros de fecha, usar query raw
    if (month || year) {
      const conditions: string[] = [];
      if (status) {
        conditions.push(`status = '${status}'`);
      }
      if (month) conditions.push(`EXTRACT(MONTH FROM created_at) = ${month}`);
      if (year) conditions.push(`EXTRACT(YEAR FROM created_at) = ${year}`);
      
      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
      const limitClause = limit ? `LIMIT ${parseInt(limit)}` : '';
      
      complaints = await (prisma as any).$queryRawUnsafe(
        `SELECT c.*, 
         jsonb_build_object('id', u.id, 'name', u.name, 'email', u.email, 'role', u.role) as reviewer
         FROM complaints c
         LEFT JOIN users u ON c.reviewed_by = u.id
         ${whereClause} 
         ORDER BY c.created_at DESC 
         ${limitClause}`
      );
    } else {
      // Usar Prisma normal para filtros simples
      const where: any = {};
      if (status) {
        where.status = status;
      }

      complaints = await (prisma as any).complaint.findMany({
        where,
        take: limit ? parseInt(limit) : undefined,
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    return NextResponse.json({ complaints });
  } catch (error) {
    console.error('Error al obtener denuncias:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
