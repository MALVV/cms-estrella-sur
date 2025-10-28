import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const convocatoriaId = searchParams.get('convocatoriaId');
    const status = searchParams.get('status');
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (convocatoriaId) {
      where.convocatoriaId = convocatoriaId;
    }

    if (status) {
      where.status = status;
    }

    // Filtro por año y mes
    if (year || month) {
      const dateFilter: any = {};
      
      if (year) {
        const yearInt = parseInt(year);
        dateFilter.gte = new Date(yearInt, month ? parseInt(month) - 1 : 0, 1);
        
        if (month) {
          // Si se especifica mes, filtrar desde el primer día del mes hasta el último
          const daysInMonth = new Date(yearInt, parseInt(month), 0).getDate();
          dateFilter.lte = new Date(yearInt, parseInt(month) - 1, daysInMonth, 23, 59, 59);
        } else {
          // Si solo se especifica año, filtrar todo el año
          dateFilter.lte = new Date(yearInt, 11, 31, 23, 59, 59);
        }
      }
      
      where.createdAt = dateFilter;
    }

    const [applications, total] = await Promise.all([
      prisma.convocatoriaApplication.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          convocatoria: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.convocatoriaApplication.count({ where })
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

