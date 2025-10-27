const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeAnnualGoal() {
  try {
    const currentYear = new Date().getFullYear();
    
    // Verificar si ya existe una meta para el año actual
    const existingGoal = await prisma.annualGoal.findUnique({
      where: { year: currentYear }
    });

    if (existingGoal) {
      console.log(`Ya existe una meta para el año ${currentYear}:`);
      console.log(`- Meta: Bs. ${existingGoal.targetAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
      console.log(`- Actual: Bs. ${existingGoal.currentAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
      console.log(`- Progreso: ${Math.round((existingGoal.currentAmount / existingGoal.targetAmount) * 100)}%`);
      return;
    }

    // Crear meta anual por defecto
    const annualGoal = await prisma.annualGoal.create({
      data: {
        year: currentYear,
        targetAmount: 75000,
        currentAmount: 45250,
        description: `Meta de recaudación para el año ${currentYear}`,
        isActive: true
      }
    });

    console.log(`✅ Meta anual creada para ${currentYear}:`);
    console.log(`- Meta: Bs. ${annualGoal.targetAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
    console.log(`- Actual: Bs. ${annualGoal.currentAmount.toLocaleString('es-BO', { minimumFractionDigits: 2 })}`);
    console.log(`- Progreso: ${Math.round((annualGoal.currentAmount / annualGoal.targetAmount) * 100)}%`);

  } catch (error) {
    console.error('Error al inicializar meta anual:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initializeAnnualGoal();
