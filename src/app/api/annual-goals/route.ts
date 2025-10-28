import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentYearOnly = searchParams.get('currentYearOnly');
    
    if (currentYearOnly === 'true') {
      // Para la página pública, retornar la meta destacada o la del año actual
      let annualGoal = await prisma.annualGoal.findFirst({
        where: { 
          isFeatured: true,
          isActive: true 
        }
      });

      // Si no hay meta destacada, usar la del año actual
      if (!annualGoal) {
        const currentYear = new Date().getFullYear();
        annualGoal = await prisma.annualGoal.findUnique({
          where: { year: currentYear }
        });

        // Si no existe, crear una meta por defecto
        if (!annualGoal) {
          annualGoal = await prisma.annualGoal.create({
            data: {
              year: currentYear,
              targetAmount: 75000,
              currentAmount: 45250,
              description: `Meta de recaudación para el año ${currentYear}`,
              isActive: true,
              isFeatured: false
            }
          });
        }
      }

      return NextResponse.json(annualGoal);
    } else {
      // Para el dashboard, retornar todas las metas
      const annualGoals = await prisma.annualGoal.findMany({
        orderBy: { year: 'desc' }
      });

      return NextResponse.json(annualGoals);
    }
  } catch (error) {
    console.error('Error fetching annual goals:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Requerir autenticación de ADMINISTRATOR
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { year, targetAmount, description } = body;

    if (!year || !targetAmount) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: year, targetAmount' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una meta para este año
    const existingGoal = await prisma.annualGoal.findUnique({
      where: { year: parseInt(year) }
    });

    if (existingGoal) {
      return NextResponse.json(
        { error: `Ya existe una meta para el año ${year}` },
        { status: 409 }
      );
    }

    const annualGoal = await prisma.annualGoal.create({
      data: {
        year: parseInt(year),
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        description: description || null,
        isActive: true
      }
    });

    return NextResponse.json(annualGoal, { status: 201 });
  } catch (error) {
    console.error('Error creating annual goal:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Requerir autenticación de ADMINISTRATOR
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, year, targetAmount, currentAmount, description, isActive, isFeatured } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (year !== undefined) updateData.year = parseInt(year);
    if (targetAmount !== undefined) updateData.targetAmount = parseFloat(targetAmount);
    if (currentAmount !== undefined) updateData.currentAmount = parseFloat(currentAmount);
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    // Si se está marcando como destacada, verificar que no haya otra meta destacada
    if (isFeatured === true) {
      const featuredGoals = await prisma.annualGoal.findMany({
        where: { 
          id: { not: id },
          isFeatured: true,
          isActive: true
        }
      });

      if (featuredGoals.length > 0) {
        return NextResponse.json(
          { 
            error: 'Ya existe una meta anual destacada. Debe desmarcar la meta destacada actual primero.',
            code: 'FEATURED_LIMIT_REACHED',
            currentFeaturedGoal: featuredGoals[0]
          },
          { status: 400 }
        );
      }
    }

    const annualGoal = await prisma.annualGoal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(annualGoal);
  } catch (error) {
    console.error('Error updating annual goal:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Requerir autenticación de ADMINISTRATOR
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido' },
        { status: 400 }
      );
    }

    // Verificar que la meta existe
    const annualGoal = await prisma.annualGoal.findUnique({
      where: { id }
    });

    if (!annualGoal) {
      return NextResponse.json(
        { error: 'Meta anual no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la meta
    await prisma.annualGoal.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Meta anual eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting annual goal:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}