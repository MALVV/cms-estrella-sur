import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function updateAnnualGoalAmount() {
  try {
    const currentYear = new Date().getFullYear();
    
    // Buscar la meta del año actual
    let annualGoal = await prisma.annualGoal.findUnique({
      where: { year: currentYear }
    });

    if (!annualGoal) {
      // Si no existe, crear una meta por defecto
      annualGoal = await prisma.annualGoal.create({
        data: {
          year: currentYear,
          targetAmount: 75000,
          currentAmount: 0,
          description: `Meta de recaudación para el año ${currentYear}`,
          isActive: true,
          isFeatured: false
        }
      });
    }

    // Calcular el monto actual sumando todas las donaciones aprobadas del año actual
    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

    // Sumar donaciones de proyectos específicos aprobadas del año actual
    const projectDonations = await prisma.donation.aggregate({
      where: {
        status: 'APPROVED',
        approvedAt: {
          gte: startOfYear,
          lte: endOfYear
        },
        donationProjectId: {
          not: null
        }
      },
      _sum: {
        amount: true
      }
    });

    // Sumar donaciones generales aprobadas del año actual
    const generalDonations = await prisma.donation.aggregate({
      where: {
        status: 'APPROVED',
        approvedAt: {
          gte: startOfYear,
          lte: endOfYear
        },
        donationProjectId: null
      },
      _sum: {
        amount: true
      }
    });

    const totalProjectAmount = Number(projectDonations._sum.amount || 0);
    const totalGeneralAmount = Number(generalDonations._sum.amount || 0);
    const totalCurrentAmount = totalProjectAmount + totalGeneralAmount;

    // Actualizar la meta anual con el monto calculado
    const updatedGoal = await prisma.annualGoal.update({
      where: { id: annualGoal.id },
      data: {
        currentAmount: totalCurrentAmount
      }
    });

    return updatedGoal;
  } catch (error) {
    console.error('Error updating annual goal amount:', error);
    throw error;
  }
}

export async function getAnnualGoal() {
  try {
    const currentYear = new Date().getFullYear();
    
    let annualGoal = await prisma.annualGoal.findUnique({
      where: { year: currentYear }
    });

    if (!annualGoal) {
      // Si no existe, crear una meta por defecto
      annualGoal = await prisma.annualGoal.create({
        data: {
          year: currentYear,
          targetAmount: 75000,
          currentAmount: 0,
          description: `Meta de recaudación para el año ${currentYear}`,
          isActive: true
        }
      });
    }

    return annualGoal;
  } catch (error) {
    console.error('Error getting annual goal:', error);
    throw error;
  }
}
